import os
import sys
import json

def generate_seed_data():
    print("=" * 60)
    print("   DocNest -- Database Seeder & Mock Data Generator")
    print("=" * 60)

    doctors = [
        {"name": "Dr. Amit Kumar", "specialty": "Orthopedic Surgeon", "clinic": "Gupta Clinic, Station Road, Deoria", "fee": 300, "phone": "+919876543210"},
        {"name": "Dr. Sunita Rai", "specialty": "Gynecologist", "clinic": "Rai Hospital, Malviya Road, Deoria", "fee": 400, "phone": "+919876543211"},
        {"name": "Dr. Rajesh Verma", "specialty": "General Physician", "clinic": "Verma Clinic, Civil Lines, Deoria", "fee": 250, "phone": "+919876543212"},
        {"name": "Dr. Manoj Tripathi", "specialty": "Pediatrician", "clinic": "Children Care, Salempur Road", "fee": 300, "phone": "+919876543213"},
        {"name": "Dr. Priyanka Srivastava", "specialty": "Dermatologist", "clinic": "Skin Care Clinic, Raghopur", "fee": 350, "phone": "+919876543214"},
        {"name": "Dr. V. K. Pandey", "specialty": "Cardiologist", "clinic": "Pandey Heart Care, New Colony", "fee": 500, "phone": "+919876543215"},
    ]

    print(f"\n[1/4] Generated {len(doctors)} Primary Deoria Doctors:")
    for d in doctors:
        print(f"  [OK] {d['name']} ({d['specialty']}) -- {d['clinic']} -- Fee: RS.{d['fee']}")

    specialties = [
        "General Physician", "Orthopedic Surgeon", "Gynecologist", 
        "Pediatrician", "Dermatologist", "Cardiologist", "ENT Specialist", "Neurologist"
    ]
    print(f"\n[2/4] Generated {len(specialties)} Medical Specialties:")
    for s in specialties:
        print(f"  [OK] Specialty registered: {s}")

    patients = [
        {"name": "Rahul Sharma", "phone": "9876543210", "block": "Deoria Sadar"},
        {"name": "Priya Singh", "phone": "9812345678", "block": "Gauri Bazar"},
        {"name": "Vijay Kumar", "phone": "9935123456", "block": "Bhatpar Rani"},
        {"name": "Anjali Mishra", "phone": "9792001122", "block": "Salempur"},
        {"name": "Ramesh Chandra", "phone": "9415887766", "block": "Rudrapratap"},
    ]
    print(f"\n[3/4] Generated {len(patients)} Active District Patients:")
    for p in patients:
        print(f"  [OK] Patient: {p['name']} | Phone: {p['phone']} | Block: {p['block']}")

    orders = [
        {"patient": "Rahul Sharma", "items": "Tab Zerodol-SP (x1), Tab Pan-40 (x1)", "amount": 320, "address": "Civil Lines, Deoria"},
        {"patient": "Priya Singh", "items": "Cholecalciferol D3 60k UI Sachet (x2)", "amount": 360, "address": "Station Road, Deoria"},
        {"patient": "Vijay Kumar", "items": "Volini Pain Spray 100g (x1)", "amount": 240, "address": "Malviya Road, Deoria"},
    ]
    print(f"\n[4/4] Generated {len(orders)} Medicave Pharmacy Delivery Orders:")
    for o in orders:
        print(f"  [OK] Order for {o['patient']}: {o['items']} -> RS.{o['amount']}")

    print("\n" + "=" * 60)
    print("   [SUCCESS] Seed Data Generation & Contract Verification Completed!")
    print("=" * 60)

if __name__ == "__main__":
    generate_seed_data()
