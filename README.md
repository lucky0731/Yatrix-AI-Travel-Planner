<div align="center">

# ✈️ Yatrix

### A multi-agent AI travel planner built with LangGraph, LangChain and FastAPI

*Describe your trip in plain English — Yatrix returns flight options, hotel ideas and a day-by-day itinerary in one place.*

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-1C3C3C?logo=langchain&logoColor=white)](https://www.langchain.com/langgraph)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Groq](https://img.shields.io/badge/Groq-LLM-F55036)](https://groq.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-State-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing)

[✨ Features](#-features) •
[🚀 Quickstart](#-quickstart) •
[🏗️ Architecture](#️-architecture) •
[🔌 API](#-api-reference) •
[🤝 Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [🌟 Why Yatrix?](#-why-yatrix)
- [✨ Features](#-features)
- [📸 Demo](#-demo)
- [🏗️ Architecture](#️-architecture)
- [⚙️ How It Works](#️-how-it-works)
- [💡 Example Prompts](#-example-prompts)
- [🧰 Tech Stack](#-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quickstart](#-quickstart)
- [🔐 Configuration](#-configuration)
- [🔌 API Reference](#-api-reference)
- [📁 Project Structure](#-project-structure)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [🛡️ Security](#️-security)
- [📜 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)
- [💬 Support](#-support)

---

## 🌟 Why Yatrix?

Planning a trip usually means juggling flight sites, hotel listings, blogs and spreadsheets. **Yatrix** brings all of that into one conversation.

Just say something like *"Plan a 3-day trip to Tokyo with a budget of $1200"* and a team of specialized agents gets to work:

- ✈️ a **flight agent** researches flights
- 🏨 a **hotel agent** finds places to stay
- 🗓️ an **itinerary agent** builds a day-by-day plan
- ✨ a **final agent** turns it all into one polished answer

All of them are coordinated by a **LangGraph** workflow, and conversation state is saved in **PostgreSQL** so the planner can remember the context of your trip.

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| ✈️ | **Flight research** | Live flight data from the AviationStack API |
| 🏨 | **Hotel suggestions** | Accommodation ideas found through Tavily web search |
| 🗓️ | **Day-by-day itineraries** | Structured, practical travel plans |
| 🧠 | **Multi-agent orchestration** | Specialized agents coordinated by a LangGraph state graph |
| ⚡ | **Fast LLM responses** | Powered by Groq's low-latency inference |
| 💾 | **Persistent conversations** | Graph state checkpointed in PostgreSQL |
| 🌐 | **Web UI + REST API** | A browser interface plus a JSON endpoint for integrations |

---

## 📸 Demo

> 💡 *Add a screenshot or GIF of Yatrix here.*

```markdown
![Yatrix UI](docs/screenshot.png)
```

---

## 🏗️ Architecture

```mermaid
flowchart LR
    U([👤 User]) --> UI[🌐 Web UI<br/>Jinja2 + JS]
    U -.->|REST| API
    UI --> API[⚡ FastAPI<br/>app.py]
    API --> G{{🧠 LangGraph Workflow<br/>backend.py}}
    G --> F[✈️ Flight Agent]
    F -->|flights| AS[(AviationStack)]
    F --> H[🏨 Hotel Agent]
    H -->|search| TV[(Tavily)]
    H --> I[🗓️ Itinerary Agent]
    I --> FN[✨ Final Agent]
    FN --> API
    G <-.->|checkpoints| DB[(🐘 PostgreSQL)]
    G <-.->|LLM calls| GQ[(⚡ Groq)]
```

---

## ⚙️ How It Works

| Step | Agent | What it does |
|:---:|---|---|
| 1️⃣ | 👤 **User** | Submits a trip request through the web UI or the API |
| 2️⃣ | ✈️ **Flight Agent** | Gathers flight information from AviationStack |
| 3️⃣ | 🏨 **Hotel Agent** | Searches the web with Tavily for accommodation options |
| 4️⃣ | 🗓️ **Itinerary Agent** | Builds a practical, day-by-day travel plan |
| 5️⃣ | ✨ **Final Agent** | Combines everything into one polished response |

---

## 💡 Example Prompts

```text
🗼  Plan a 3-day trip to Tokyo with a budget of $1200
🏖️  I want a relaxing 5-day beach holiday in Bali in December
🏔️  Suggest a 4-day itinerary for Switzerland with scenic train rides
🍜  Plan a weekend food trip to Bangkok for two people
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| 🐍 Language | Python 3.10+ |
| ⚡ Backend | FastAPI |
| 🎨 Frontend | Jinja2 templates + HTML / CSS / JavaScript |
| 🧠 Orchestration | LangGraph |
| 🦜 Framework | LangChain |
| 🤖 LLM | Groq |
| 🐘 Database | PostgreSQL |
| 🔍 Search | Tavily API |
| ✈️ Flights | AviationStack API |

---

## 📋 Prerequisites

- ✅ Python **3.10 or newer**
- ✅ **PostgreSQL** running and accessible — [download](https://www.postgresql.org/download/)
- ✅ API keys for:
  - 🤖 **Groq** — [get one here](https://console.groq.com/keys)
  - 🔍 **Tavily** — [get one here](https://tavily.com/)
  - ✈️ **AviationStack** — [get one here](https://aviationstack.com/) (free plan available)

---

## 🚀 Quickstart

### 1️⃣ Clone the repository

```bash
git clone https://github.com/lucky0731/Yatrix.git
cd Yatrix
```

### 2️⃣ Create and activate a virtual environment

**🐍 Using Conda**

```bash
conda create -n yatrix python=3.11 -y
conda activate yatrix
```

**Or using venv**

```bash
python -m venv .venv

# 🪟 Windows
.venv\Scripts\activate

# 🍎 macOS / 🐧 Linux
source .venv/bin/activate
```

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Set up the database

Create a PostgreSQL database for Yatrix:

```bash
createdb travel_db
```

Or from inside `psql`:

```sql
CREATE DATABASE travel_db;
```

### 5️⃣ Configure environment variables

Create a `.env` file in the project root (see [Configuration](#-configuration) below).

### 6️⃣ Run the app

```bash
python app.py
```

Then open 👉 **http://127.0.0.1:8000/**

---

## 🔐 Configuration

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/travel_db
GROQ_API_KEY=your_groq_api_key
AVIATIONSTACK_API_KEY=your_aviationstack_api_key
TAVILY_API_KEY=your_tavily_api_key
DEFAULT_ORIGIN_IATA=DAC
```

| Variable | Required | Description |
|---|:---:|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string used to save conversation state |
| `GROQ_API_KEY` | ✅ | API key for the Groq LLM |
| `AVIATIONSTACK_API_KEY` | ✅ | API key for flight data |
| `TAVILY_API_KEY` | ✅ | API key for hotel / web search |
| `DEFAULT_ORIGIN_IATA` | ⚪ | Default departure airport code when the request doesn't name one (e.g. `DAC` = Dhaka, `BOM` = Mumbai, `DEL` = Delhi) |

> ⚠️ **Never commit your `.env` file.** Make sure it's listed in `.gitignore`, and rotate any key that gets exposed.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/health` | 💚 Health check |
| `POST` | `/api/travel` | ✈️ Submit a travel request |

### Example request

```bash
curl -X POST http://127.0.0.1:8000/api/travel \
  -H "Content-Type: application/json" \
  -d '{"message": "Plan a 3-day trip to Tokyo with a budget of $1200"}'
```

<details>
<summary>🪟 <b>Windows PowerShell version</b></summary>

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/api/travel `
  -Method Post -ContentType "application/json" `
  -Body '{"message": "Plan a 3-day trip to Tokyo with a budget of $1200"}'
```
</details>

> 💡 FastAPI also generates interactive API docs at **http://127.0.0.1:8000/docs** where you can try the endpoints in your browser.

---

## 📁 Project Structure

```
.
├── ⚡ app.py              # FastAPI app entry point
├── 🧠 backend.py          # LangGraph travel workflow
├── 📦 requirements.txt    # Python dependencies
├── 🎨 static/             # Static frontend assets (CSS, JS)
├── 🖼️ templates/          # HTML templates (Jinja2)
├── 🛠️ tools/              # Flight and web search integrations
├── 🔑 .env                # Environment variables (not committed)
└── 📖 README.md
```

---

## 🛠️ Troubleshooting

<details>
<summary>🐘 <b>Can't connect to PostgreSQL</b></summary>

- Check that PostgreSQL is running
- Make sure the database in `DATABASE_URL` exists (`createdb travel_db`)
- Double-check the username, password, host and port in `DATABASE_URL`
</details>

<details>
<summary>✈️ <b>No flight results</b></summary>

- Confirm `AVIATIONSTACK_API_KEY` is set correctly
- The free AviationStack plan has a monthly request limit and some feature restrictions
- Check that `DEFAULT_ORIGIN_IATA` is a valid 3-letter airport code
</details>

<details>
<summary>🚪 <b>Port 8000 is already in use</b></summary>

Stop the other process using port 8000, or change the port in `app.py`.
</details>

<details>
<summary>⏱️ <b>Rate limit errors</b></summary>

Groq, Tavily and AviationStack all enforce rate limits. Wait a moment and retry, or upgrade your plan.
</details>

<details>
<summary>🔑 <b>Authentication errors from an API</b></summary>

Make sure `.env` is in the project root and every key is filled in without quotes or extra spaces.
</details>

---

## 🗺️ Roadmap

- [ ] 💰 Budget breakdown per day and per category
- [ ] 🗺️ Interactive map of itinerary stops
- [ ] 🌦️ Weather forecast for travel dates
- [ ] 📄 Export itineraries to PDF
- [ ] 🐳 Docker Compose setup with PostgreSQL included

> 💡 Have an idea? [Open an issue](../../issues) and let's discuss it!

---

## 🤝 Contributing

Contributions are welcome — whether you want to improve the app, add new travel features, or fix bugs! 🎉

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. 💾 **Commit** your changes
   ```bash
   git commit -m "Add amazing feature"
   ```
4. 📤 **Push** to your branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. 🔃 **Open a Pull Request**

**Guidelines**

- 🐛 For bugs or larger changes, open an issue first to discuss them
- 🎯 Keep pull requests focused on a single change
- 📝 Update this README when behaviour or setup changes
- 🔑 Never include real API keys in commits
- 🙌 Be respectful and constructive

---

## 🛡️ Security

If you find a security vulnerability, **please don't open a public issue.** Report it privately through GitHub's [security advisories](../../security/advisories/new).

---

## 📜 License

Distributed under the **Apache License 2.0**. See [`LICENSE`](LICENSE) for details.

---

## 🙏 Acknowledgements

- 🧠 [**LangGraph**](https://www.langchain.com/langgraph) — stateful multi-agent orchestration
- 🦜 [**LangChain**](https://www.langchain.com/) — LLM application framework
- ⚡ [**Groq**](https://groq.com/) — fast LLM inference
- ⚡ [**FastAPI**](https://fastapi.tiangolo.com/) — the web framework
- 🐘 [**PostgreSQL**](https://www.postgresql.org/) — persistent conversation state
- 🔍 [**Tavily**](https://tavily.com/) — LLM-friendly web search
- ✈️ [**AviationStack**](https://aviationstack.com/) — flight data
- 🎨 [**Shields.io**](https://shields.io/) — README badges

---

## 💬 Support

- 🐛 **Found a bug?** [Open an issue](../../issues/new)
- 💡 **Have a feature idea?** [Start a discussion](../../discussions)
- ⭐ **Like the project?** Give it a star — it helps others find it!
- 🔁 **Share it** with fellow travellers and developers

---

<div align="center">

### 👨‍💻 Author

**Lucky Agrawal**

<a href="https://github.com/lucky0731">
  <img src="https://github.com/lucky0731.png" width="96" alt="Lucky Agrawal" style="border-radius:50%"/>
</a>

[![GitHub](https://img.shields.io/badge/GitHub-lucky0731-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lucky0731)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Lucky%20Agrawal-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucky-agrawal/)

<br/>

Made with ❤️ and ✈️ using LangGraph & FastAPI

⭐ **If Yatrix helped plan your trip, please star the repo!** ⭐

</div>