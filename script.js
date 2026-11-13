const themeButton = document.querySelector("#theme-toggle");
const nameInput = document.querySelector("#visitor-name");
const greeting = document.querySelector("#greeting");
const commentForm = document.querySelector("#comment-form");
const comments = document.querySelector("#comments");

themeButton.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme", !isDark);
    themeButton.setAttribute("aria-pressed", String(isDark));
});

nameInput.addEventListener("input", () => {
    const name = nameInput.value.trim();
    greeting.textContent = name ? `Вітаємо, ${name}!` : "";
});

commentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const authorInput = commentForm.elements.namedItem("author");
    const commentInput = commentForm.elements.namedItem("comment");
    const author = authorInput.value.trim();
    const text = commentInput.value.trim();

    if (!author || !text) return;

    const item = document.createElement("li");
    item.textContent = `${author}: ${text}`;
    comments.appendChild(item);

    commentForm.reset();
    authorInput.focus();
});

const htmlButton = document.querySelector("#load-html");
const htmlStatus = document.querySelector("#html-status");
const htmlContent = document.querySelector("#html-content");

htmlButton.addEventListener("click", () => {
    htmlButton.disabled = true;
    htmlStatus.textContent = "Завантаження…";
    htmlContent.replaceChildren();

    fetch("fragment.html")
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then((html) => {
            htmlContent.innerHTML = html;
            htmlStatus.textContent = "HTML завантажено.";
        })
        .catch(() => {
            htmlStatus.textContent = "Не вдалося завантажити HTML.";
        })
        .finally(() => {
            htmlButton.disabled = false;
        });
});

const jsonButton = document.querySelector("#load-json");
const jsonStatus = document.querySelector("#json-status");
const jsonContent = document.querySelector("#json-content");

jsonButton.addEventListener("click", async () => {
    jsonButton.disabled = true;
    jsonStatus.textContent = "Завантаження…";
    jsonContent.replaceChildren();

    try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data) || !data.every((item) =>
            item && typeof item.author === "string" && typeof item.text === "string"
        )) {
            throw new Error("Невідповідна структура JSON");
        }

        for (const comment of data) {
            const item = document.createElement("li");
            item.textContent = `${comment.author}: ${comment.text}`;
            jsonContent.appendChild(item);
        }

        jsonStatus.textContent = data.length ? "JSON завантажено." : "Даних немає.";
    } catch {
        jsonStatus.textContent = "Не вдалося завантажити JSON.";
    } finally {
        jsonButton.disabled = false;
    }
});