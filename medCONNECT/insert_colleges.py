"""
Script to insert Telangana Government Medical Colleges into the database
Run this script to populate the colleges table
"""
import asyncio
from app.db.supabase import supabase_client
from loguru import logger

# Telangana Government Medical Colleges Data
TELANGANA_COLLEGES = [
    # Major Established Colleges
    {"name": "Osmania Medical College", "code": "OMC-HYD", "city": "Hyderabad", "state": "Telangana"},
    {"name": "Gandhi Medical College", "code": "GMC-SEC", "city": "Secunderabad", "state": "Telangana"},
    {"name": "Kakatiya Medical College", "code": "KMC-WGL", "city": "Warangal", "state": "Telangana"},
    {"name": "Rajiv Gandhi Institute of Medical Sciences", "code": "RGIMS-ADB", "city": "Adilabad", "state": "Telangana"},
    {"name": "Government Medical College Nizamabad", "code": "GMC-NZB", "city": "Nizamabad", "state": "Telangana"},
    {"name": "Government Medical College Mahabubnagar", "code": "GMC-MBNR", "city": "Mahabubnagar", "state": "Telangana"},
    {"name": "Government Medical College Siddipet", "code": "GMC-SDPT", "city": "Siddipet", "state": "Telangana"},
    {"name": "Government Medical College Nalgonda", "code": "GMC-NLG", "city": "Nalgonda", "state": "Telangana"},
    {"name": "Government Medical College Suryapet", "code": "GMC-SYP", "city": "Suryapet", "state": "Telangana"},
    {"name": "Government Medical College Mancherial", "code": "GMC-MCH", "city": "Mancherial", "state": "Telangana"},
    {"name": "Government Medical College Jagtial", "code": "GMC-JGL", "city": "Jagtial", "state": "Telangana"},
    {"name": "Government Medical College Karimnagar", "code": "GMC-KRM", "city": "Karimnagar", "state": "Telangana"},
    {"name": "Government Medical College Sangareddy", "code": "GMC-SGR", "city": "Sangareddy", "state": "Telangana"},
    {"name": "Government Medical College Bhadradri Kothagudem", "code": "GMC-BDK", "city": "Bhadradri Kothagudem", "state": "Telangana"},
    {"name": "Government Medical College Jangaon", "code": "GMC-JGN", "city": "Jangaon", "state": "Telangana"},
    {"name": "Government Medical College Jayashankar Bhupalpally", "code": "GMC-JSB", "city": "Jayashankar Bhupalpally", "state": "Telangana"},
    {"name": "Government Medical College Kamareddy", "code": "GMC-KMR", "city": "Kamareddy", "state": "Telangana"},
    {"name": "Government Medical College Khammam", "code": "GMC-KHM", "city": "Khammam", "state": "Telangana"},
    {"name": "Government Medical College Vikarabad", "code": "GMC-VKB", "city": "Vikarabad", "state": "Telangana"},
    {"name": "Government Medical College Nirmal", "code": "GMC-NRM", "city": "Nirmal", "state": "Telangana"},
    {"name": "Government Medical College Rajanna Sircilla", "code": "GMC-RNS", "city": "Rajanna Sircilla", "state": "Telangana"},
    {"name": "Government Medical College Medak", "code": "GMC-MDK", "city": "Medak", "state": "Telangana"},
    {"name": "Government Medical College Quthbullapur", "code": "GMC-QTB", "city": "Quthbullapur", "state": "Telangana"},
    {"name": "Government Medical College Yadadri", "code": "GMC-YDR", "city": "Yadadri", "state": "Telangana"},
    {"name": "Government Medical College Mulugu", "code": "GMC-MLG", "city": "Mulugu", "state": "Telangana"},
    {"name": "Government Medical College Maheshwaram", "code": "GMC-MHS", "city": "Maheshwaram", "state": "Telangana"},
    {"name": "Government Medical College Narsampet", "code": "GMC-NSP", "city": "Narsampet", "state": "Telangana"},
    {"name": "Government Medical College Narayanpet", "code": "GMC-NYP", "city": "Narayanpet", "state": "Telangana"},
    {"name": "Government Medical College Jogulamba Gadwal", "code": "GMC-JGW", "city": "Jogulamba Gadwal", "state": "Telangana"},
    {"name": "All India Institute of Medical Sciences Bibinagar", "code": "AIIMS-BBN", "city": "Bibinagar", "state": "Telangana"},
    {"name": "Employees State Insurance Corporation Medical College", "code": "ESIC-HYD", "city": "Hyderabad", "state": "Telangana"},
]


def insert_colleges():
    """Insert Telangana colleges into the database"""
    try:
        client = supabase_client.get_client()
        
        inserted = 0
        skipped = 0
        errors = []
        
        for college in TELANGANA_COLLEGES:
            try:
                # Check if college already exists
                existing = supabase_client.select_one(
                    "colleges",
                    filters={"code": college["code"]}
                )
                
                if existing:
                    logger.info(f"College {college['name']} already exists, skipping...")
                    skipped += 1
                    continue
                
                # Insert new college
                result = supabase_client.insert("colleges", college)
                logger.success(f"Inserted: {college['name']} ({college['code']})")
                inserted += 1
                
            except Exception as e:
                error_msg = f"Error inserting {college['name']}: {str(e)}"
                logger.error(error_msg)
                errors.append(error_msg)
        
        # Summary
        logger.info(f"\n{'='*50}")
        logger.info(f"Insertion Summary:")
        logger.info(f"  ✅ Inserted: {inserted}")
        logger.info(f"  ⏭️  Skipped: {skipped}")
        logger.info(f"  ❌ Errors: {len(errors)}")
        logger.info(f"{'='*50}")
        
        if errors:
            logger.warning("Errors encountered:")
            for error in errors:
                logger.warning(f"  - {error}")
        
        # Verify
        all_colleges = supabase_client.select(
            "colleges",
            filters={"state": "Telangana"},
            order_by="name"
        )
        logger.info(f"\nTotal Telangana colleges in database: {len(all_colleges)}")
        
        return {
            "inserted": inserted,
            "skipped": skipped,
            "errors": len(errors),
            "total": len(all_colleges)
        }
        
    except Exception as e:
        logger.error(f"Failed to insert colleges: {e}")
        raise


if __name__ == "__main__":
    print("Inserting Telangana Government Medical Colleges...")
    print("=" * 60)
    result = insert_colleges()
    print("\nDone!")
    print(f"Inserted: {result['inserted']}, Skipped: {result['skipped']}, Total: {result['total']}")

