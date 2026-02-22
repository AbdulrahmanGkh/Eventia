
import pypdf
import sys
import os

def extract_text(pdf_path):
    print(f"--- Extracting from {pdf_path} ---")
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        print(text)
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
    print(f"--- End of {pdf_path} ---")

if __name__ == "__main__":
    files = ["CSC496_Report_22333 copy.pdf", "Copy of Copy of Eventia Poster-8.pdf"]
    for f in files:
        if os.path.exists(f):
            extract_text(f)
        else:
            print(f"File not found: {f}")
