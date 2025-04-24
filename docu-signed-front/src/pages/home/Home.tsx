import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { uploadDocument } from "../../services/DocumentService";
function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // ako postoji token korisnik je ulogovan
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleContinue = async () => {
    if (!selectedFile) return;
    try {
      const result = await uploadDocument(selectedFile);
      // alert("Upload successful!");
      // console.log("Uploaded document info:", result);
      navigate("/upload", { state: { document: result } });
      setSelectedFile(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
    }
  };

  return (
    <div className={styles.container}>
      {/* <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img
            src={require("../../assets/logodocu.png")}
            alt="DocuSigned Logo"
            className={styles.logoImage}
          />
          <h1 className={styles.logo}>DocuSigned</h1>{" "}
        </div>
        <nav className={styles.navbar}>
          <ul>
            <li>
              <a href="#about" className={styles.navLink}>
                About DocuSigned
              </a>
            </li>
            <li>
              <a href="#contact" className={styles.navLink}>
                Contact Us
              </a>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <a
                    href="/login"
                    className={`${styles.navLink} ${styles.loginBtn}`}
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href="/register"
                    className={`${styles.navLink} ${styles.registerBtn}`}
                  >
                    Sign Up
                  </a>
                </li>
              </>
            ) : (
              <li>
                <a onClick={handleLogout} className={styles.navLink}>
                  Logout
                </a>
              </li>
            )}
          </ul>
        </nav>
      </header> */}

      <main className={styles.mainContent}>
        <section className={styles.textSection}>
          <h2 className={styles.mainHeading}>Welcome to DocuSigned!</h2>
          <p className={styles.mainText}>
            DocuSigned provides you with the easiest way to sign documents
            online. Secure, fast, and legally binding. Get started with your
            digital signatures today!
          </p>
          {/* {isLoggedIn && (
            <div className={styles.buttonWrapper}>
              <Button
                onClick={() => (window.location.href = "/upload")}
                className={styles.uploadBtn}
              >
                Upload Document
              </Button>
            </div>
          )} */}
          {isLoggedIn && (
            <div className={styles.buttonWrapper}>
              <Button onClick={handleUploadClick} className={styles.uploadBtn}>
                Upload document
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          )}
          {selectedFile && (
            <div className={styles.previewBox}>
              <div className={styles.buttonRow}>
                <button className={styles.tinyButton} onClick={handleContinue}>
                  ✓
                </button>
                <button
                  className={styles.tinyButton}
                  onClick={() => setSelectedFile(null)}
                >
                  ✕
                </button>
              </div>

              <p className={styles.filename}>{selectedFile.name}</p>

              {selectedFile.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className={styles.tinyPreviewImage}
                />
              )}

              {selectedFile.type === "application/pdf" && (
                <iframe
                  src={URL.createObjectURL(selectedFile)}
                  className={styles.tinyPreviewPdf}
                  title="PDF Preview"
                />
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
