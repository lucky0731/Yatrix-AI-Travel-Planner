(function () {
    const $ = (id) => document.getElementById(id);

    let currentThreadId = localStorage.getItem("travel_thread_id") || null;

    const state = {
        origin: $("origin").value,
        destination: $("destination").value,
        startDate: "",
        days: 7,
        pax: 2,
        budgetMin: 100000,
        budgetMax: 200000,
        travelClass: "Economy",
        pace: "balanced",
        notes: ""
    };

    // default departure date: 30 days out
    const d = new Date();
    d.setDate(d.getDate() + 30);
    $("startDate").value = d.toISOString().slice(0, 10);
    state.startDate = $("startDate").value;

    function inr(n) {
        return "₹" + Number(n).toLocaleString("en-IN");
    }
    function shortLakh(n) {
        return (n / 100000).toFixed(1).replace(/\.0$/, "") + "L";
    }
    function iata(city) {
        const m = city.match(/\(([A-Z]{3})\)/);
        return m ? m[1] : city.slice(0, 3).toUpperCase();
    }
    function destCode(dest) {
        const known = { japan: "TOK", tokyo: "TOK", dubai: "DXB", thailand: "BKK", bangkok: "BKK" };
        const key = Object.keys(known).find(k => dest.toLowerCase().includes(k));
        return key ? known[key] : (dest.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "—");
    }

    // ---- builds the natural-language request sent to /api/travel ----
    function composeMessage() {
        const dateStr = state.startDate
            ? new Date(state.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "a flexible date";
        let msg = `Plan a complete ${state.days}-day trip to ${state.destination || "[destination]"} from ${state.origin}, `
            + `for ${state.pax} traveler${state.pax > 1 ? "s" : ""}, departing ${dateStr}. `
            + `Travel class: ${state.travelClass}. Itinerary pace: ${state.pace}. `
            + `Budget: ${inr(state.budgetMin)}–${inr(state.budgetMax)}.`;
        if (state.notes.trim()) msg += ` Special requests: ${state.notes.trim()}.`;
        return msg;
    }

    function updateStats() {
        $("statRoute").textContent = iata(state.origin) + " → " + (state.destination ? destCode(state.destination) : "—");
        $("statDuration").textContent = state.days + "D / " + Math.max(state.days - 1, 0) + "N";
        $("statPax").textContent = state.pax;
        $("statBudget").textContent = shortLakh(state.budgetMin) + "–" + shortLakh(state.budgetMax);
    }

    function updateSummary() {
        $("summaryText").textContent = composeMessage();
        updateStats();
    }

    // ---- origin / destination / date / notes ----
    $("origin").addEventListener("change", e => { state.origin = e.target.value; updateSummary(); });
    $("destination").addEventListener("input", e => { state.destination = e.target.value; updateSummary(); });
    $("startDate").addEventListener("change", e => { state.startDate = e.target.value; updateSummary(); });
    $("notes").addEventListener("input", e => { state.notes = e.target.value; updateSummary(); });

    // ---- days stepper ----
    function setDays(v) {
        v = Math.min(30, Math.max(1, v));
        state.days = v;
        $("days").value = v;
        document.querySelectorAll("#dayChips .chip").forEach(c => {
            c.setAttribute("aria-pressed", String(Number(c.dataset.days) === v));
        });
        updateSummary();
    }
    $("daysMinus").addEventListener("click", () => setDays(state.days - 1));
    $("daysPlus").addEventListener("click", () => setDays(state.days + 1));
    $("days").addEventListener("change", e => setDays(parseInt(e.target.value, 10) || 1));
    document.querySelectorAll("#dayChips .chip").forEach(c => {
        c.addEventListener("click", () => setDays(Number(c.dataset.days)));
    });

    // ---- pax stepper ----
    function setPax(v) {
        v = Math.min(10, Math.max(1, v));
        state.pax = v;
        $("pax").value = v;
        updateSummary();
    }
    $("paxMinus").addEventListener("click", () => setPax(state.pax - 1));
    $("paxPlus").addEventListener("click", () => setPax(state.pax + 1));
    $("pax").addEventListener("change", e => setPax(parseInt(e.target.value, 10) || 1));

    // ---- segmented controls ----
    function wireSegmented(containerId, onSelect) {
        const container = $(containerId);
        container.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
                container.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", "false"));
                btn.setAttribute("aria-pressed", "true");
                onSelect(btn.dataset.value);
            });
        });
    }
    wireSegmented("travelClass", v => { state.travelClass = v; updateSummary(); });
    wireSegmented("pace", v => { state.pace = v; updateSummary(); });

    // ---- dual range slider (budget band) ----
    const minInput = $("budgetMin"), maxInput = $("budgetMax"), fill = $("budgetFill");
    const rangeMin = 20000, rangeMax = 2000000, rangeStep = 10000;
    function pct(v) { return ((v - rangeMin) / (rangeMax - rangeMin)) * 100; }
    function renderRange() {
        let lo = parseInt(minInput.value, 10), hi = parseInt(maxInput.value, 10);
        if (lo > hi - rangeStep) { lo = hi - rangeStep; minInput.value = lo; }
        state.budgetMin = lo; state.budgetMax = hi;
        fill.style.left = pct(lo) + "%";
        fill.style.right = (100 - pct(hi)) + "%";
        $("budgetMinLabel").textContent = inr(lo);
        $("budgetMaxLabel").textContent = inr(hi);
        updateSummary();
    }
    minInput.addEventListener("input", renderRange);
    maxInput.addEventListener("input", renderRange);

    // ---- quick route presets ----
    const presets = {
        japan: { destination: "Tokyo, Japan", days: 7, budgetMin: 150000, budgetMax: 200000, travelClass: "Economy", pace: "balanced" },
        dubai: { destination: "Dubai, UAE", days: 5, budgetMin: 70000, budgetMax: 110000, travelClass: "Economy", pace: "packed" },
        thailand: { destination: "Bangkok, Thailand", days: 7, budgetMin: 60000, budgetMax: 90000, travelClass: "Economy", pace: "relaxed" },
        dubaiLux: { destination: "Dubai, UAE", days: 4, budgetMin: 250000, budgetMax: 400000, travelClass: "Business", pace: "relaxed" }
    };
    document.querySelectorAll(".route-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const p = presets[chip.dataset.preset];
            $("destination").value = p.destination; state.destination = p.destination;
            setDays(p.days);
            minInput.value = p.budgetMin; maxInput.value = p.budgetMax; renderRange();
            document.querySelectorAll("#travelClass button").forEach(b => {
                const on = b.dataset.value === p.travelClass;
                b.setAttribute("aria-pressed", String(on));
                if (on) state.travelClass = p.travelClass;
            });
            document.querySelectorAll("#pace button").forEach(b => {
                const on = b.dataset.value === p.pace;
                b.setAttribute("aria-pressed", String(on));
                if (on) state.pace = p.pace;
            });
            updateSummary();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    // ---- generate: real call to your FastAPI /api/travel endpoint ----
    let lastMarkdown = "";
    const generateBtn = $("generateBtn"), loadingRow = $("loadingRow"), manifest = $("manifest"), errorMsg = $("errorMsg");

    function showError(text) {
        errorMsg.textContent = text;
        errorMsg.classList.add("show");
    }
    function hideError() {
        errorMsg.classList.remove("show");
    }

    generateBtn.addEventListener("click", async () => {
        if (!state.destination.trim()) {
            showError("Please enter a destination before generating your manifest.");
            $("destination").focus();
            return;
        }
        hideError();
        generateBtn.disabled = true;
        $("generateSub").textContent = "sending…";
        loadingRow.style.display = "flex";
        manifest.classList.remove("show");

        try {
            const response = await fetch("/api/travel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: composeMessage(),
                    thread_id: currentThreadId
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Something went wrong.");
            }

            currentThreadId = data.thread_id;
            localStorage.setItem("travel_thread_id", currentThreadId);

            lastMarkdown = data.answer;
            $("manifestBody").innerHTML = (typeof marked !== "undefined") ? marked.parse(lastMarkdown) : lastMarkdown;
            $("manifestRoute").textContent = "Thread: " + currentThreadId + " · " + iata(state.origin) + " → " + destCode(state.destination);
            manifest.classList.add("show");
            manifest.scrollIntoView({ behavior: "smooth", block: "start" });

        } catch (error) {
            showError(error.message || "Something went wrong while generating your plan.");
        } finally {
            loadingRow.style.display = "none";
            generateBtn.disabled = false;
            $("generateSub").textContent = "→ POST /api/travel";
        }
    });

    $("copyBtn").addEventListener("click", () => {
        const text = $("manifestBody").innerText;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            const old = $("copyBtn").textContent;
            $("copyBtn").textContent = "Copied!";
            setTimeout(() => $("copyBtn").textContent = old, 1300);
        }).catch(() => showError("Could not copy result."));
    });

    $("downloadBtn").addEventListener("click", () => {
        const el = $("manifest");
        if (!lastMarkdown || typeof html2pdf === "undefined") return;
        const btn = $("downloadBtn");
        const old = btn.textContent;
        btn.textContent = "Preparing…";
        btn.disabled = true;
        html2pdf().set({
            margin: 0.5,
            filename: "tripmate-itinerary.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] }
        }).from(el).save()
            .then(() => { btn.textContent = old; btn.disabled = false; })
            .catch(() => { btn.textContent = old; btn.disabled = false; showError("Could not download PDF."); });
    });

    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.key === "Enter") {
            generateBtn.click();
        }
    });

    renderRange();
    updateSummary();
})();
