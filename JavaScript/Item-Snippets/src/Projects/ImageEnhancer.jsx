import React, { useState } from "react"

export default function PicWishImageEnhancer() {
    const [imageUrl, setImageUrl] = useState("")
    const [processedImage, setProcessedImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [taskId, setTaskId] = useState(null)

    const handleUrlChange = (event) => {
        setImageUrl(event.target.value)
        setError(null)
        setProcessedImage(null)
        setTaskId(null)
    }

    const enhanceImage = async () => {
        if (!imageUrl) {
            setError("Please enter an image URL first")
            return
        }

        // Basic URL validation
        try {
            new URL(imageUrl)
        } catch (e) {
            setError("Please enter a valid URL")
            return
        }

        setIsLoading(true)
        setError(null)
        setProcessedImage(null)

        try {
            const payload = {
                image_url: imageUrl,
                size: "2",
                model: "general",
            }

            const response = await fetch(
                "https://techhk.aoscdn.com/api/tasks/visual/scale",
                {
                    method: "POST",
                    headers: {
                        "X-API-KEY": "wx3jezqm17qozxjlr",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "API request failed")
            }

            const responseData = await response.json()
            if (responseData.status !== 200) {
                throw new Error(responseData.message || "API processing failed")
            }

            setTaskId(responseData.data.task_id)

            // Poll for results (simplified version - in production you might want to implement proper polling)
            const pollForResult = async () => {
                try {
                    const newResponse = await fetch(
                        `https://techhk.aoscdn.com/api/tasks/visual/scale/${responseData.data.task_id}`,
                        {
                            method: "GET",
                            headers: {
                                "X-API-KEY": "wx3a3hvqd05awdxyb",
                            },
                        }
                    )
                    const newResponseData = await newResponse.json()

                    if (newResponseData.data?.image) {
                        setProcessedImage(newResponseData.data.image)
                    } else {
                        // If image not ready yet, poll again after delay
                        setTimeout(pollForResult, 2000)
                    }
                } catch (err) {
                    console.error("Polling error:", err)
                    setError("Failed to get enhanced image. Please try again.")
                    setIsLoading(false)
                }
            }

            pollForResult()
        } catch (error) {
            console.error("Error enhancing image:", error)
            setError(
                error.message || "Failed to enhance image. Please try again."
            )
            setIsLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Image Enhancer</h1>
            <p style={styles.subtitle}>
                Enhance your images using AI-powered technology
            </p>

            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    placeholder="Paste your image URL here..."
                    disabled={isLoading}
                    style={styles.input}
                />
                <button
                    onClick={enhanceImage}
                    disabled={isLoading || !imageUrl}
                    style={{
                        ...styles.button,
                        ...(isLoading && styles.buttonLoading),
                        ...(!imageUrl && styles.buttonDisabled),
                    }}
                >
                    {isLoading ? (
                        <span style={styles.buttonContent}>
                            <span style={styles.spinner}></span>
                            Processing...
                        </span>
                    ) : (
                        "Enhance Image"
                    )}
                </button>
            </div>

            {error && (
                <div style={styles.error}>
                    <svg style={styles.errorIcon} viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-2h2V17z M13,13h-2V7h2V13z"
                        />
                    </svg>
                    {error}
                </div>
            )}

            {taskId && (
                <div style={styles.taskId}>
                    <span style={styles.taskIdLabel}>Task ID:</span> {taskId}
                </div>
            )}

            <div style={styles.imageGrid}>
                {imageUrl && (
                    <div style={styles.imageCard}>
                        <h4 style={styles.imageTitle}>Original Image</h4>
                        <div style={styles.imageWrapper}>
                            <img
                                src={imageUrl}
                                alt="original"
                                style={styles.image}
                                onError={() =>
                                    setError(
                                        "Failed to load the image from URL"
                                    )
                                }
                            />
                        </div>
                    </div>
                )}

                {processedImage ? (
                    <div style={styles.imageCard}>
                        <h4 style={styles.imageTitle}>Enhanced Image</h4>
                        <div style={styles.imageWrapper}>
                            <img
                                src={processedImage}
                                alt="processed"
                                style={styles.image}
                            />
                        </div>
                        <a
                            href={processedImage}
                            download="enhanced-image.png"
                            style={styles.downloadButton}
                        >
                            Download Enhanced Image
                        </a>
                    </div>
                ) : (
                    isLoading && (
                        <div style={styles.imageCard}>
                            <h4 style={styles.imageTitle}>Enhanced Image</h4>
                            <div style={styles.loadingPlaceholder}>
                                <div style={styles.loadingAnimation}>
                                    <div style={styles.loadingDot}></div>
                                    <div style={styles.loadingDot}></div>
                                    <div style={styles.loadingDot}></div>
                                </div>
                                <p style={styles.loadingText}>
                                    Enhancing your image...
                                </p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
    },
    header: {
        fontSize: "2.5rem",
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: "0.5rem",
        textAlign: "center",
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "#7f8c8d",
        textAlign: "center",
        marginBottom: "2rem",
    },
    inputContainer: {
        display: "flex",
        gap: "1rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
    },
    input: {
        flex: "1",
        minWidth: "300px",
        padding: "0.8rem 1rem",
        fontSize: "1rem",
        border: "1px solid #ddd",
        borderRadius: "6px",
        outline: "none",
        transition: "border 0.3s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        ":focus": {
            borderColor: "#3498db",
            boxShadow: "0 0 0 3px rgba(52,152,219,0.2)",
        },
    },
    button: {
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        fontWeight: "600",
        color: "white",
        backgroundColor: "#3498db",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        ":hover": {
            backgroundColor: "#2980b9",
            transform: "translateY(-1px)",
        },
        ":active": {
            transform: "translateY(0)",
        },
    },
    buttonLoading: {
        backgroundColor: "#95a5a6",
        cursor: "not-allowed",
        ":hover": {
            backgroundColor: "#95a5a6",
            transform: "none",
        },
    },
    buttonDisabled: {
        backgroundColor: "#bdc3c7",
        cursor: "not-allowed",
        ":hover": {
            backgroundColor: "#bdc3c7",
            transform: "none",
        },
    },
    buttonContent: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    spinner: {
        width: "16px",
        height: "16px",
        border: "3px solid rgba(255,255,255,0.3)",
        borderRadius: "50%",
        borderTopColor: "white",
        animation: "spin 1s ease-in-out infinite",
    },
    error: {
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        marginBottom: "1.5rem",
        backgroundColor: "#fdecea",
        color: "#d32f2f",
        borderRadius: "6px",
        fontSize: "0.95rem",
    },
    errorIcon: {
        width: "20px",
        height: "20px",
        marginRight: "0.5rem",
    },
    taskId: {
        padding: "0.8rem 1rem",
        marginBottom: "1.5rem",
        backgroundColor: "#e3f2fd",
        color: "#1976d2",
        borderRadius: "6px",
        fontSize: "0.9rem",
        wordBreak: "break-all",
    },
    taskIdLabel: {
        fontWeight: "600",
    },
    imageGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "2rem",
        marginTop: "2rem",
    },
    imageCard: {
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
    imageTitle: {
        margin: "0",
        padding: "1rem 1.5rem",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #eee",
        fontSize: "1.2rem",
        color: "#2c3e50",
    },
    imageWrapper: {
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
    },
    image: {
        maxWidth: "100%",
        maxHeight: "400px",
        borderRadius: "4px",
        objectFit: "contain",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    downloadButton: {
        display: "block",
        textAlign: "center",
        padding: "0.8rem",
        margin: "1.5rem",
        backgroundColor: "#27ae60",
        color: "white",
        textDecoration: "none",
        borderRadius: "6px",
        fontWeight: "600",
        transition: "background-color 0.2s",
        ":hover": {
            backgroundColor: "#219653",
        },
    },
    loadingPlaceholder: {
        flex: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem",
        backgroundColor: "#f8f9fa",
    },
    loadingAnimation: {
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1rem",
    },
    loadingDot: {
        width: "12px",
        height: "12px",
        backgroundColor: "#3498db",
        borderRadius: "50%",
        animation: "bounce 1.4s infinite ease-in-out",
        ":nth-child(1)": {
            animationDelay: "0s",
        },
        ":nth-child(2)": {
            animationDelay: "0.2s",
        },
        ":nth-child(3)": {
            animationDelay: "0.4s",
        },
    },
    loadingText: {
        margin: "0",
        color: "#7f8c8d",
        fontSize: "0.95rem",
    },
    "@keyframes spin": {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
    },
    "@keyframes bounce": {
        "0%, 80%, 100%": { transform: "scale(0)" },
        "40%": { transform: "scale(1)" },
    },
}
