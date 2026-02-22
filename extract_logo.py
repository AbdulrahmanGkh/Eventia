
import pypdf

def extract_images(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    page = reader.pages[0]
    count = 0
    for image_file_object in page.images:
        with open(f"assets/extracted_logo_{count}.png", "wb") as fp:
            fp.write(image_file_object.data)
            count += 1
    print(f"Extracted {count} images")

if __name__ == "__main__":
    extract_images("Eventia logo.pdf")
