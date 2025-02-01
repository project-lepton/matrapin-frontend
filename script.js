async function generatePIN() {
    let input = document.getElementById("wordInput").value.trim();
    let language = document.getElementById("language").value;

    if (!input) {
        alert("Please enter a word");
        return;
    }

    if (language === "none") {
        alert("Please select a language.");
        return;
    }

    try {
        let response = await fetch("https://matrapin-backend.onrender.com/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input, language })
        });

        let data = await response.json();
        document.getElementById("transliterated").textContent = data.transliterated_text;
        applyFont(language);
        document.getElementById("transliteration-section").classList.remove("hidden");

        document.getElementById("pin4").textContent = data["4-digit PIN"];
        document.getElementById("pin6").textContent = data["6-digit PIN"];
        document.getElementById("alphaPin").textContent = data["alphanumeric PIN"];

        document.getElementById("results").classList.remove("hidden");
        
        // Schema.org Structured Data for SEO
        addStructuredData(input, language, data);
    } catch (error) {
        console.error("PIN Generation Error:", error);
        alert("Failed to generate PIN. Please try again.");
    }
}

function addStructuredData(input, language, data) {
    let script = document.getElementById('seo-script') || document.createElement('script');
    script.id = 'seo-script';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "matrapin",
        "description": "Your Words, Your Security. MatraPin: Secure PINs from the Heart of Indian Languages.",
        "applicationCategory": "PIN and Password Generator",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0"
        },
        "keywords": ["secure PIN", language + " PIN", "multilingual password"]
    });
    document.head.appendChild(script);
}

function applyFont(language) {
    let textElement = document.getElementById("transliterated");

    const fontMapping = {
        "odia": "OdiaFont1",
        "telugu": "TeluguFont1",
        "tamil": "TamilFont1",
        "malayalam": "MalayalamFont1"
    };

    textElement.style.fontFamily = fontMapping[language] || "Arial";
}

function copyText(elementId) {
    let text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    }).catch(err => {
        console.error("Copy failed:", err);
    });
}

function resetForm() {
    document.getElementById("wordInput").value = "";
    document.getElementById("language").selectedIndex = 0;
    document.getElementById("results").classList.add("hidden");
    document.getElementById("transliteration-section").classList.add("hidden");
    
    ["transliterated", "pin4", "pin6", "alphaPin"].forEach(id => {
        document.getElementById(id).textContent = "";
    });
}