-- Migration 003: Realtime Publications for Live OPD Queue Counter
-- Run this in Supabase SQL Editor to enable websocket broadcasts for clinic queues

-- 1. Add clinic_queues and queue_entries to supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'clinic_queues'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.clinic_queues;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'queue_entries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_entries;
  END IF;
END $$;

-- 2. Helper function to increment current token for a doctor's active queue
CREATE OR REPLACE FUNCTION public.increment_doctor_token(p_doctor_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_queue_id UUID;
  v_current INT;
  v_total INT;
  v_res JSONB;
BEGIN
  -- Get or create active queue for today
  SELECT id, current_token, next_token - 1 INTO v_queue_id, v_current, v_total
  FROM public.clinic_queues
  WHERE doctor_id = p_doctor_id AND queue_date = CURRENT_DATE;

  IF v_queue_id IS NULL THEN
    INSERT INTO public.clinic_queues (doctor_id, queue_date, status, current_token, next_token)
    VALUES (p_doctor_id, CURRENT_DATE, 'active', 1, 2)
    RETURNING id, current_token, next_token - 1 INTO v_queue_id, v_current, v_total;
  ELSE
    UPDATE public.clinic_queues
    SET current_token = current_token + 1
    WHERE id = v_queue_id
    RETURNING current_token INTO v_current;
  END IF;

  -- Mark active queue entry as in_consultation
  UPDATE public.queue_entries
  SET status = 'completed'
  WHERE queue_id = v_queue_id AND status = 'in_consultation';

  UPDATE public.queue_entries
  SET status = 'in_consultation', called_at = NOW()
  WHERE queue_id = v_queue_id AND token_number = v_current;

  v_res := jsonb_build_object(
    'queue_id', v_queue_id,
    'current_token', v_current,
    'total_issued', v_total
  );

  RETURN v_res;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
