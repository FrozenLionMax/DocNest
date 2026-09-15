import os
import sys
import subprocess

def log(msg, status="INFO"):
    symbol = "[OK]" if status == "SUCCESS" else "[INFO]" if status == "INFO" else "[ERROR]"
    print(f"{symbol} {msg}")

def run_step(description, command, cwd):
    print(f"\n--- {description} ---")
    try:
        res = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        if res.returncode == 0:
            log(f"{description} PASSED", "SUCCESS")
            return True
        else:
            log(f"{description} FAILED with exit code {res.returncode}", "ERROR")
            print(res.stderr or res.stdout)
            return False
    except Exception as e:
        log(f"{description} EXCEPTION: {e}", "ERROR")
        return False

def check_master_sql():
    sql_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../supabase/migrations/000_full_schema_production.sql"))
    if os.path.exists(sql_path):
        size = os.path.getsize(sql_path)
        log(f"Master SQL script present at {sql_path} ({size} bytes)", "SUCCESS")
        return True
    else:
        log(f"Master SQL script missing!", "ERROR")
        return False

def verify_web_builds(base_dir):
    doctor_ok = run_step("Doctor Web Build (next build)", "npm run build", os.path.join(base_dir, "apps/doctor-web"))
    admin_ok = run_step("Admin Web Build (next build)", "npm run build", os.path.join(base_dir, "apps/admin-web"))
    return doctor_ok and admin_ok

def main():
    print("=" * 60)
    print("      DocNest Production Release & Build Orchestration")
    print("=" * 60)

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    # 1. Master SQL script validation
    sql_ok = check_master_sql()
    
    # 2. Next.js Web Portals Build Verification
    web_ok = verify_web_builds(base_dir)

    print("\n" + "=" * 60)
    if sql_ok and web_ok:
        log("DocNest Production Deployment & Release Check: ALL PASSED", "SUCCESS")
    else:
        log("DocNest Production Release Check: FAILED", "ERROR")
        sys.exit(1)

if __name__ == "__main__":
    main()
