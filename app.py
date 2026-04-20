import streamlit as st
from groq import Groq
import re

# --- Page Config ---
st.set_page_config(
    page_title="Culture Bridge",
    page_icon="🌍",
    layout="centered"
)

# --- Custom CSS ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
    
    .main { background: #f8fafc; }
    
    .hero {
        text-align: center;
        padding: 2rem 0 1rem;
    }
    .hero h1 {
        font-size: 2.4rem;
        font-weight: 800;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.2;
        margin-bottom: 0.5rem;
    }
    .hero p {
        color: #64748b;
        font-size: 1.05rem;
    }
    
    .result-box {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 1.5rem;
        margin-top: 1rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .result-box h3 {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 0.6rem;
        color: #0f172a;
    }
    .rewritten-msg {
        font-size: 1.05rem;
        line-height: 1.7;
        color: #1e293b;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        margin-bottom: 1rem;
    }
    .meta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 0.5rem;
    }
    .meta-box {
        border-radius: 10px;
        padding: 0.9rem;
        font-size: 0.88rem;
        line-height: 1.6;
    }
    .explain-box {
        background: #fffbeb;
        border: 1px solid #fde68a;
        color: #78350f;
    }
    .tip-box {
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        color: #064e3b;
    }
    .meta-label {
        font-weight: 700;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 5px;
    }

    div[data-testid="stSelectbox"] label,
    div[data-testid="stTextArea"] label {
        font-weight: 600;
        color: #0f172a;
    }
    
    div[data-testid="stAlert"] {
        border-radius: 12px;
    }
    
    .stButton button {
        width: 100%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
        color: white !important;
        font-weight: 700 !important;
        font-size: 1rem !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 0.75rem 1.5rem !important;
        box-shadow: 0 6px 20px rgba(99,102,241,0.35) !important;
        transition: opacity 0.2s !important;
    }
    .stButton button:hover { opacity: 0.9 !important; }

    .stTabs [data-baseweb="tab-list"] {
        background: white;
        border-radius: 12px;
        padding: 5px;
        border: 1px solid #e2e8f0;
        gap: 4px;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 9px;
        font-weight: 600;
        font-size: 0.9rem;
    }
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
        color: white !important;
    }
    
    footer { visibility: hidden; }
</style>
""", unsafe_allow_html=True)


# --- Header ---
st.markdown("""
<div class="hero">
    <div style="font-size:3rem;margin-bottom:0.5rem">🌍</div>
    <h1>Culture Bridge</h1>
    <p>Rewrite messages for any culture's communication style, powered by Groq AI</p>
</div>
""", unsafe_allow_html=True)

st.markdown("---")

# --- API Key ---
api_key = st.text_input(
    "🔑 Groq API Key",
    type="password",
    placeholder="gsk_...",
    help="Get your free key at console.groq.com"
)

CULTURE_FLAGS = {"USA": "🇺🇸", "Japan": "🇯🇵", "India": "🇮🇳", "Germany": "🇩🇪"}


def call_groq(api_key: str, message: str, culture: str, tone: str) -> dict:
    client = Groq(api_key=api_key)
    system_prompt = f"""You are a Cross-Cultural Communication Assistant. Rewrite messages to match the communication style of the target culture.

Adjust tone, politeness, directness, and formality.
Target culture: {culture}
Tone: {tone}

Instructions:
* Keep it professional and respectful
* Avoid stereotypes
* Be concise and practical

Output format (use exactly these labels):
Rewritten Message: [your rewritten message]
Explanation: [short explanation of why tone changed]
Etiquette Tip: [one practical etiquette tip for this culture]"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Rewrite this message:\n\n{message}"}
        ],
        temperature=0.7,
        max_tokens=1024
    )

    text = response.choices[0].message.content or ""
    rewritten = re.search(r"Rewritten Message:\s*([\s\S]*?)(?=\nExplanation:|$)", text, re.I)
    explanation = re.search(r"Explanation:\s*([\s\S]*?)(?=\nEtiquette Tip:|$)", text, re.I)
    tip = re.search(r"Etiquette Tip:\s*([\s\S]*?)$", text, re.I)

    return {
        "rewritten": rewritten.group(1).strip() if rewritten else text,
        "explanation": explanation.group(1).strip() if explanation else "",
        "tip": tip.group(1).strip() if tip else ""
    }


def show_result(culture: str, data: dict):
    flag = CULTURE_FLAGS.get(culture, "🌐")
    st.markdown(f"""
    <div class="result-box">
        <h3>{flag} Rewritten for {culture}</h3>
        <div class="rewritten-msg">{data['rewritten']}</div>
        <div class="meta-grid">
            <div class="meta-box explain-box">
                <div class="meta-label">💡 Why it changed</div>
                {data['explanation']}
            </div>
            <div class="meta-box tip-box">
                <div class="meta-label">🌍 Etiquette Tip</div>
                {data['tip']}
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)


# --- Tabs ---
tab1, tab2 = st.tabs(["⚡ Single Rewrite", "🌐 Compare Cultures"])

# ── Tab 1: Single Rewrite ──
with tab1:
    message = st.text_area(
        "Your Message",
        placeholder="e.g. I need this report by tomorrow or we will miss the deadline.",
        height=120
    )
    col1, col2 = st.columns(2)
    with col1:
        culture = st.selectbox("Target Culture", ["USA", "Japan", "India", "Germany"], key="s_culture")
    with col2:
        tone = st.selectbox("Desired Tone", ["Professional", "Formal", "Casual", "Friendly"], key="s_tone")

    if st.button("✈️ Rewrite Message", key="single_btn"):
        if not api_key:
            st.error("⚠️ Please enter your Groq API key above.")
        elif not message.strip():
            st.error("⚠️ Please enter a message to rewrite.")
        else:
            with st.spinner(f"Adapting message for {culture}..."):
                try:
                    result = call_groq(api_key, message, culture, tone)
                    show_result(culture, result)
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")

# ── Tab 2: Compare Cultures ──
with tab2:
    message_c = st.text_area(
        "Your Message",
        placeholder="e.g. We need to discuss your recent performance.",
        height=120,
        key="compare_msg"
    )
    tone_c = st.selectbox("Base Tone", ["Professional", "Formal", "Casual", "Friendly"], key="c_tone")

    if st.button("🌐 Compare All Cultures", key="compare_btn"):
        if not api_key:
            st.error("⚠️ Please enter your Groq API key above.")
        elif not message_c.strip():
            st.error("⚠️ Please enter a message to compare.")
        else:
            cultures = ["USA", "Japan", "India", "Germany"]
            cols = st.columns(2)
            for i, cult in enumerate(cultures):
                with cols[i % 2]:
                    with st.spinner(f"{CULTURE_FLAGS[cult]} Generating for {cult}..."):
                        try:
                            result = call_groq(api_key, message_c, cult, tone_c)
                            show_result(cult, result)
                        except Exception as e:
                            st.error(f"❌ {cult}: {str(e)}")
