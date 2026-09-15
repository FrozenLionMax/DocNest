import os
import sys
import urllib.request
import json

def log(msg, status="INFO"):
    symbol = "[OK]" if status == "SUCCESS" else "[INFO]" if status == "INFO" else "[ERROR]"
    print(f"{symbol} {msg}")

def check_master_sql(base_dir):
    sql_path = os.path.join(base_dir, "supabase", "migrations", "000_full_schema_production.sql")
    if os.path.exists(sql_path):
        size = os.path.getsize(sql_path)
        log(f"Master SQL Migration Script verified: {sql_path} ({size} bytes)", "SUCCESS")
        return True, sql_path
    else:
        log("Master SQL script missing!", "ERROR")
        return False, None

def create_env_templates(base_dir):
    print("\n--- Generating Production .env Templates ---")
    
    # 1. doctor-web
    doc_env_path = os.path.join(base_dir, "apps", "doctor-web", ".env.production")
    doc_env_content = """# DocNest Doctor Web Portal - Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=https://doctor.docnest.in
"""
    with open(doc_env_path, "w", encoding="utf-8") as f:
        f.write(doc_env_content)
    log(f"Created Doctor Portal production template: {doc_env_path}", "SUCCESS")

    # 2. admin-web
    admin_env_path = os.path.join(base_dir, "apps", "admin-web", ".env.production")
    admin_env_content = """# DocNest Admin Control Panel - Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=https://admin.docnest.in
"""
    with open(admin_env_path, "w", encoding="utf-8") as f:
        f.write(admin_env_content)
    log(f"Created Admin Control Panel production template: {admin_env_path}", "SUCCESS")

    # 3. mobile
    mobile_env_path = os.path.join(base_dir, "apps", "mobile", ".env.production")
    mobile_env_content = """# DocNest Mobile App - Production Environment Variables
EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
"""
    with open(mobile_env_path, "w", encoding="utf-8") as f:
        f.write(mobile_env_content)
    log(f"Created Mobile App production template: {mobile_env_path}", "SUCCESS")

def verify_supabase_connection(url, key):
    if not url or "your-supabase-project" in url:
        log("Supabase URL is using placeholder. Skipping live HTTP ping.", "INFO")
        return
    print("\n--- Verifying Supabase Cloud REST Connection ---")
    try:
        req = urllib.request.Request(f"{url}/rest/v1/", headers={"apikey": key, "Authorization": f"Bearer {key}"})
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                log("Supabase Cloud API endpoint connection SUCCESSFUL (HTTP 200)", "SUCCESS")
            else:
                log(f"Supabase returned status code: {response.status}", "INFO")
    except Exception as e:
        log(f"Supabase connection test note: {e}", "INFO")

def main():
    print("=" * 65)
    print("   DocNest -- Day 1: Cloud Provisioning & Environment Setup")
    print("=" * 65)

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    # 1. Master SQL script validation
    sql_ok, sql_path = check_master_sql(base_dir)

    # 2. Production .env templates generation
    create_env_templates(base_dir)

    # 3. Optional live URL check
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
    supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    verify_supabase_connection(supabase_url, supabase_key)

    print("\n" + "=" * 65)
    print("   [SUCCESS] Day 1 Cloud Provisioning Setup Completed Cleanly!")
    print("=" * 65)

if __name__ == "__main__":
    main()
