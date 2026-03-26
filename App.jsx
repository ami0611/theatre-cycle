import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://tyrynfnwxazpbzusdgef.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cnluZm53eGF6cGJ6dXNkZ2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjczODAsImV4cCI6MjA5MDA0MzM4MH0.ukwVXGVbelMkrLsooC3FBD7ne-QX14sYhhUkfho9m9w";

function createClient(url, key) {
  const h = { "Content-Type": "application/json", "apikey": key, "Authorization": `Bearer ${key}` };
  return {
    from: (table) => ({
      select: async () => {
        const res = await fetch(`${url}/rest/v1/${table}?select=*&order=created_at.desc`, { headers: h });
        const data = await res.json();
        return { data: Array.isArray(data) ? data : [], error: res.ok ? null : data };
      },
      insert: async (row) => {
        const res = await fetch(`${url}/rest/v1/${table}`, {
          method: "POST", headers: { ...h, "Prefer": "return=representation" }, body: JSON.stringify(row)
        });
        const data = await res.json();
        return { data, error: res.ok ? null : data };
      },
      update: async (row, matchCol, matchVal) => {
        const res = await fetch(`${url}/rest/v1/${table}?${matchCol}=eq.${matchVal}`, {
          method: "PATCH", headers: { ...h, "Prefer": "return=representation" }, body: JSON.stringify(row)
        });
        const data = await res.json();
        return { data, error: res.ok ? null : data };
      },
    }),
    storage: {
      upload: async (bucket, path, file) => {
        const res = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
          method: "POST", headers: { "apikey": key, "Authorization": `Bearer ${key}`, "Content-Type": file.type },
          body: file
        });
        const data = await res.json();
        return { data, error: res.ok ? null : data };
      },
      getPublicUrl: (bucket, path) => `${url}/storage/v1/object/public/${bucket}/${path}`,
    }
  };
}

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const T = {
  ja: {
    appName: "シアター・サイクル", appSub: "劇場プロップ・衣装・セット共有プラットフォーム",
    appDesc: "劇場間でプロップ・衣装・セットを共有。廃棄物を減らし、舞台芸術を循環させましょう。",
    tabs: ["一覧", "求むリスト", "提供する", "求む投稿"],
    searchPlaceholder: "アイテム・劇場名で検索",
    itemsFound: (n) => `${n}件`,
    categories: ["すべて", "プロップ", "セット", "衣装", "照明", "その他"],
    catKeys: ["All", "Props", "Set Pieces", "Costumes", "Lighting", "Other"],
    conditions: { Excellent: "極良", Good: "良好", Fair: "普通" },
    available: "貸出可能", onLoan: "貸出中",
    contact: "連絡する", contactTheatre: "劇場に連絡する",
    markOnLoan: "貸出中にする", markAvailable: "貸出可能にする",
    wantedTitle: "求めているアイテム",
    listTitle: "アイテムを提供する", postTitle: "求む投稿を掲載する",
    categoryLabel: "カテゴリ", conditionLabel: "状態", emojiLabel: "アイコン",
    photoLabel: "写真", photoBtn: "写真を選ぶ", photoUploading: "アップロード中…",
    priceLabel: "費用（円・送料別）", priceNote: "0円 = 無料",
    shippableLabel: "配送", shippableYes: "配送可", shippableNo: "配送不可",
    shippingFeeLabel: "配送料（円）",
    free: "無料", shippingAvail: "配送可", shippingNA: "配送不可",
    shippingFeeDisplay: (n) => n === 0 ? "送料無料" : `送料 ¥${n.toLocaleString()}`,
    listBtn: "登録する", postBtn: "投稿する",
    toastList: "アイテムを登録しました", toastPost: "リクエストを投稿しました",
    toastAvail: "状態を更新しました", toastError: "必須項目をすべて入力してください",
    toastUploadErr: "写真のアップロードに失敗しました",
    loading: "読み込み中…", noItems: "アイテムが見つかりません",
    errorLoad: "データの読み込みに失敗しました",
    nameField: "アイテム名", theatreField: "劇場名", locationField: "所在地",
    contactField: "連絡先メール", descField: "説明",
    namePh: "例：ビクトリア朝の長椅子", theatrePh: "例：東京シアターカンパニー",
    locationPh: "例：東京都渋谷区", contactPh: "props@yourtheatre.jp",
    descPh: "アイテムの詳細・サイズ・状態などを記入してください",
    wantedNameField: "求めているもの", wantedNamePh: "例：1950年代の冷蔵庫プロップ",
    wantedTheatrePh: "例：渋谷舞台芸術センター", wantedLocationPh: "例：東京都渋谷区",
    wantedContactPh: "info@yourtheatre.jp",
  },
  en: {
    appName: "Theatre Cycle", appSub: "Prop, Costume & Set Sharing Platform",
    appDesc: "Share props, costumes and sets between theatres. Reduce waste. Keep the arts in circulation.",
    tabs: ["Browse", "Wanted", "List Item", "Post Request"],
    searchPlaceholder: "Search items or theatres",
    itemsFound: (n) => `${n} item${n !== 1 ? "s" : ""}`,
    categories: ["All", "Props", "Set Pieces", "Costumes", "Lighting", "Other"],
    catKeys: ["All", "Props", "Set Pieces", "Costumes", "Lighting", "Other"],
    conditions: { Excellent: "Excellent", Good: "Good", Fair: "Fair" },
    available: "Available", onLoan: "On Loan",
    contact: "Contact", contactTheatre: "Contact Theatre",
    markOnLoan: "Mark as On Loan", markAvailable: "Mark as Available",
    wantedTitle: "Items Theatres Are Looking For",
    listTitle: "List an Item to Share", postTitle: "Post a Wanted Request",
    categoryLabel: "Category", conditionLabel: "Condition", emojiLabel: "Icon",
    photoLabel: "Photo", photoBtn: "Choose Photo", photoUploading: "Uploading…",
    priceLabel: "Price (¥, excl. shipping)", priceNote: "0 = Free",
    shippableLabel: "Shipping", shippableYes: "Can ship", shippableNo: "Collection only",
    shippingFeeLabel: "Shipping fee (¥)",
    free: "Free", shippingAvail: "Can ship", shippingNA: "Collection only",
    shippingFeeDisplay: (n) => n === 0 ? "Free shipping" : `Shipping ¥${n.toLocaleString()}`,
    listBtn: "List Item", postBtn: "Post Request",
    toastList: "Item listed", toastPost: "Request posted",
    toastAvail: "Status updated", toastError: "Please fill in all required fields",
    toastUploadErr: "Photo upload failed",
    loading: "Loading…", noItems: "No items found",
    errorLoad: "Failed to load data",
    nameField: "Item Name", theatreField: "Your Theatre", locationField: "Location",
    contactField: "Contact Email", descField: "Description",
    namePh: "e.g. Victorian Chaise Longue", theatrePh: "e.g. The Roundhouse Theatre",
    locationPh: "e.g. Bristol, UK", contactPh: "props@yourtheatre.org",
    descPh: "Describe the item, dimensions, condition…",
    wantedNameField: "What are you looking for?", wantedNamePh: "e.g. 1950s Refrigerator Prop",
    wantedTheatrePh: "e.g. Stage Door Theatre", wantedLocationPh: "e.g. Cardiff, UK",
    wantedContactPh: "info@yourtheatre.org",
  },
};

const conditionColor = (c) => ({ Excellent: "#16a34a", Good: "#d97706", Fair: "#dc2626" }[c] || "#9ca3af");
const conditionBg = (c) => ({ Excellent: "#f0fdf4", Good: "#fffbeb", Fair: "#fef2f2" }[c] || "#f9fafb");
const TABS = ["browse", "wanted", "list", "post"];
const EMPTY_FORM = { title: "", category: "Props", theatre: "", location: "", condition: "Good", description: "", contact: "", image: "🎭", photo_url: "", price: 0, shippable: false, shipping_fee: 0 };

export default function App() {
  const [lang, setLang] = useState("ja");
  const t = T[lang];
  const [items, setItems] = useState([]);
  const [wanted, setWanted] = useState([]);
  const [tab, setTab] = useState("browse");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [listForm, setListForm] = useState(EMPTY_FORM);
  const [wantedForm, setWantedForm] = useState({ title: "", theatre: "", location: "", contact: "" });
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const fileRef = useRef();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const [ir, wr] = await Promise.all([db.from("items").select(), db.from("wanted").select()]);
      if (ir.error) throw new Error();
      setItems(ir.data); setWanted(wr.data);
    } catch { setError(t.errorLoad); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = items.filter(i => {
    const catMatch = category === "All" || i.category === category;
    const q = search.toLowerCase();
    return catMatch && (q === "" || i.title.toLowerCase().includes(q) || i.theatre.toLowerCase().includes(q));
  });

  // 写真アップロード
  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    const path = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { data, error } = await db.storage.upload("item-photos", path, file);
    if (error) { showToast(t.toastUploadErr); setUploading(false); return; }
    const publicUrl = db.storage.getPublicUrl("item-photos", path);
    setListForm(f => ({ ...f, photo_url: publicUrl }));
    setUploading(false);
  };

  const handleList = async () => {
    if (!listForm.title || !listForm.theatre || !listForm.contact) return showToast(t.toastError);
    setSubmitting(true);
    const row = {
      title: listForm.title, category: listForm.category, theatre: listForm.theatre,
      location: listForm.location, condition: listForm.condition, description: listForm.description,
      contact: listForm.contact, image: listForm.image, available: true,
      photo_url: listForm.photo_url || null,
      price: parseInt(listForm.price) || 0,
      shippable: listForm.shippable,
      shipping_fee: listForm.shippable ? (parseInt(listForm.shipping_fee) || 0) : 0,
    };
    const { error } = await db.from("items").insert(row);
    setSubmitting(false);
    if (error) { showToast("エラーが発生しました / Error: " + JSON.stringify(error)); return; }
    setListForm(EMPTY_FORM); setPreviewUrl("");
    showToast(t.toastList); setTab("browse"); await loadData();
  };

  const handleWanted = async () => {
    if (!wantedForm.title || !wantedForm.theatre || !wantedForm.contact) return showToast(t.toastError);
    setSubmitting(true);
    const { error } = await db.from("wanted").insert(wantedForm);
    setSubmitting(false);
    if (error) { showToast("エラーが発生しました"); return; }
    setWantedForm({ title: "", theatre: "", location: "", contact: "" });
    showToast(t.toastPost); setTab("wanted"); await loadData();
  };

  const toggleAvailable = async (item) => {
    await db.from("items").update({ available: !item.available }, "id", item.id);
    showToast(t.toastAvail); await loadData();
  };

  const inp = {
    width: "100%", padding: "0.6rem 0.8rem", borderRadius: 8,
    border: "1.5px solid #e5e7eb", background: "#fff", color: "#111",
    fontFamily: "inherit", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
  };
  const lbl = { display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#374151", marginBottom: "0.35rem" };

  return (
    <div style={{ fontFamily: "'Hiragino Sans','Noto Sans JP','Inter',sans-serif", minHeight: "100vh", background: "#f7f7f5", color: "#111" }}>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.35rem" }}>🎭</span>
            <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{t.appName}</span>
            {loading && <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>⟳</span>}
          </div>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <button onClick={loadData} title="更新" style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "1.1rem", padding: "0.2rem 0.4rem" }}>↻</button>
            <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 8, padding: "3px" }}>
              {["ja", "en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: "0.25rem 0.7rem", borderRadius: 6, border: "none",
                  background: lang === l ? "#fff" : "transparent",
                  color: lang === l ? "#111" : "#9ca3af",
                  fontFamily: "inherit", fontSize: "0.78rem", cursor: "pointer", fontWeight: lang === l ? 600 : 400,
                  boxShadow: lang === l ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}>{l === "ja" ? "日本語" : "EN"}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "#111", color: "#fff", padding: "2.5rem 1.25rem 2rem" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ margin: "0 0 0.4rem", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280" }}>{t.appSub}</p>
          <h1 style={{ margin: "0 0 0.6rem", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>{t.appName}</h1>
          <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.88rem", maxWidth: 480, lineHeight: 1.7 }}>{t.appDesc}</p>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 1.25rem", display: "flex" }}>
          {TABS.map((key, i) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: "0.85rem 1.1rem", border: "none", background: "transparent",
              color: tab === key ? "#111" : "#9ca3af",
              fontFamily: "inherit", fontSize: "0.85rem", fontWeight: tab === key ? 600 : 400,
              cursor: "pointer", borderBottom: `2px solid ${tab === key ? "#111" : "transparent"}`,
              transition: "all 0.15s", whiteSpace: "nowrap"
            }}>{t.tabs[i]}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "1.75rem 1.25rem 5rem" }}>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", color: "#dc2626", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
            {error}
            <button onClick={loadData} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", textDecoration: "underline", fontSize: "0.82rem" }}>再試行</button>
          </div>
        )}

        {/* BROWSE */}
        {tab === "browse" && (
          <div>
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>🔍</span>
                <input placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, paddingLeft: "2.1rem" }} />
              </div>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inp, width: "auto", color: "#374151", cursor: "pointer" }}>
                {t.categories.map((c, i) => <option key={c} value={t.catKeys[i]}>{c}</option>)}
              </select>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.78rem", marginBottom: "1rem" }}>{t.itemsFound(filtered.length)}</p>

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}><p>{t.loading}</p></div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "1rem" }}>
                {filtered.map(item => (
                  <div key={item.id} onClick={() => setModal(item)} style={{
                    background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12,
                    overflow: "hidden", cursor: "pointer", opacity: item.available ? 1 : 0.6,
                    transition: "box-shadow 0.15s, transform 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {/* 写真エリア */}
                    {item.photo_url ? (
                      <div style={{ height: 160, overflow: "hidden", background: "#f3f4f6" }}>
                        <img src={item.photo_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ height: 80, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{item.image}</div>
                    )}
                    <div style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        {!item.photo_url && <span />}
                        <span style={{ fontSize: "0.65rem", padding: "3px 8px", borderRadius: 20, fontWeight: 600, background: item.available ? "#f0fdf4" : "#fef2f2", color: item.available ? "#16a34a" : "#dc2626", marginLeft: "auto" }}>
                          {item.available ? t.available : t.onLoan}
                        </span>
                      </div>
                      <h3 style={{ margin: "0 0 0.4rem", fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.4 }}>{item.title}</h3>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.65rem", padding: "2px 7px", borderRadius: 20, background: "#f3f4f6", color: "#374151" }}>
                          {t.categories[t.catKeys.indexOf(item.category)] || item.category}
                        </span>
                        <span style={{ fontSize: "0.65rem", padding: "2px 7px", borderRadius: 20, background: conditionBg(item.condition), color: conditionColor(item.condition), fontWeight: 500 }}>
                          {t.conditions[item.condition] || item.condition}
                        </span>
                      </div>
                      {/* 費用・配送 */}
                      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: item.price === 0 ? "#16a34a" : "#111" }}>
                          {item.price === 0 ? `¥0 ${t.free}` : `¥${(item.price||0).toLocaleString()}`}
                        </span>
                        <span style={{ fontSize: "0.65rem", color: item.shippable ? "#2563eb" : "#9ca3af" }}>
                          {item.shippable ? `🚚 ${t.shippingAvail}` : `🏛 ${t.shippingNA}`}
                        </span>
                      </div>
                      <p style={{ margin: "0 0 0.15rem", color: "#6b7280", fontSize: "0.72rem" }}>📍 {item.location}</p>
                      <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.72rem" }}>🏛 {item.theatre}</p>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#9ca3af" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎭</div>
                    <p style={{ margin: 0 }}>{t.noItems}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* WANTED */}
        {tab === "wanted" && (
          <div>
            <h2 style={{ margin: "0 0 1.25rem", fontSize: "1rem", fontWeight: 600 }}>{t.wantedTitle}</h2>
            {loading ? <p style={{ color: "#9ca3af" }}>{t.loading}</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {wanted.map(w => (
                  <div key={w.id} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <p style={{ margin: "0 0 0.2rem", fontSize: "0.9rem", fontWeight: 600 }}>{w.title}</p>
                      <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.75rem" }}>🏛 {w.theatre}{w.location ? ` · 📍 ${w.location}` : ""}</p>
                    </div>
                    <a href={`mailto:${w.contact}`} style={{ padding: "0.45rem 1rem", background: "#111", color: "#fff", borderRadius: 8, fontSize: "0.78rem", textDecoration: "none", fontFamily: "inherit", fontWeight: 500 }}>
                      {t.contact}
                    </a>
                  </div>
                ))}
                {wanted.length === 0 && <p style={{ color: "#9ca3af" }}>{t.noItems}</p>}
              </div>
            )}
          </div>
        )}

        {/* LIST */}
        {tab === "list" && (
          <div style={{ maxWidth: 520 }}>
            <h2 style={{ margin: "0 0 1.5rem", fontSize: "1rem", fontWeight: 600 }}>{t.listTitle}</h2>

            {/* テキストフィールド */}
            {[
              ["title", t.nameField, "text", t.namePh],
              ["theatre", t.theatreField, "text", t.theatrePh],
              ["location", t.locationField, "text", t.locationPh],
              ["contact", t.contactField, "email", t.contactPh],
              ["description", t.descField, "textarea", t.descPh],
            ].map(([key, label, type, placeholder]) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={lbl}>{label}</label>
                {type === "textarea"
                  ? <textarea value={listForm[key]} onChange={e => setListForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} rows={3} style={{ ...inp, resize: "vertical" }} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                  : <input type={type} value={listForm[key]} onChange={e => setListForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} style={inp} onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
                }
              </div>
            ))}

            {/* カテゴリ・状態 */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={lbl}>{t.categoryLabel}</label>
                <select value={listForm.category} onChange={e => setListForm(f => ({ ...f, category: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                  {t.categories.slice(1).map((c, i) => <option key={c} value={t.catKeys[i + 1]}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={lbl}>{t.conditionLabel}</label>
                <select value={listForm.condition} onChange={e => setListForm(f => ({ ...f, condition: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                  {Object.entries(t.conditions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            {/* アイコン */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={lbl}>{t.emojiLabel}</label>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {["🎭","🛋️","👘","🕯️","🪑","⚔️","🏺","🎨","🎪","🪄","📦","🌿"].map(e => (
                  <button key={e} onClick={() => setListForm(f => ({ ...f, image: e }))}
                    style={{ fontSize: "1.3rem", padding: "0.35rem 0.4rem", background: listForm.image === e ? "#f3f4f6" : "#fff", border: `1.5px solid ${listForm.image === e ? "#111" : "#e5e7eb"}`, borderRadius: 8, cursor: "pointer" }}>{e}</button>
                ))}
              </div>
            </div>

            {/* 写真アップロード */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={lbl}>{t.photoLabel}</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => fileRef.current.click()} disabled={uploading}
                  style={{ padding: "0.5rem 1rem", background: "#f3f4f6", border: "1.5px solid #e5e7eb", borderRadius: 8, cursor: uploading ? "default" : "pointer", fontFamily: "inherit", fontSize: "0.85rem", color: "#374151" }}>
                  {uploading ? t.photoUploading : `📷 ${t.photoBtn}`}
                </button>
                {previewUrl && <img src={previewUrl} alt="preview" style={{ height: 60, width: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />}
              </div>
            </div>

            {/* 費用 */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={lbl}>{t.priceLabel}</label>
              <input type="number" min="0" value={listForm.price} onChange={e => setListForm(f => ({ ...f, price: e.target.value }))}
                placeholder="0" style={{ ...inp, width: "50%" }}
                onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              <span style={{ marginLeft: "0.5rem", fontSize: "0.78rem", color: "#9ca3af" }}>{t.priceNote}</span>
            </div>

            {/* 配送可否 */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={lbl}>{t.shippableLabel}</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[true, false].map(v => (
                  <button key={String(v)} onClick={() => setListForm(f => ({ ...f, shippable: v }))}
                    style={{ padding: "0.45rem 1rem", borderRadius: 8, border: "1.5px solid", borderColor: listForm.shippable === v ? "#111" : "#e5e7eb", background: listForm.shippable === v ? "#111" : "#fff", color: listForm.shippable === v ? "#fff" : "#374151", fontFamily: "inherit", fontSize: "0.85rem", cursor: "pointer" }}>
                    {v ? t.shippableYes : t.shippableNo}
                  </button>
                ))}
              </div>
            </div>

            {/* 配送料 */}
            {listForm.shippable && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={lbl}>{t.shippingFeeLabel}</label>
                <input type="number" min="0" value={listForm.shipping_fee} onChange={e => setListForm(f => ({ ...f, shipping_fee: e.target.value }))}
                  placeholder="0" style={{ ...inp, width: "50%" }}
                  onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              </div>
            )}

            <div style={{ marginTop: "1.5rem" }}>
              <button onClick={handleList} disabled={submitting || uploading}
                style={{ padding: "0.7rem 2.5rem", background: submitting ? "#9ca3af" : "#111", color: "#fff", border: "none", borderRadius: 8, fontFamily: "inherit", fontWeight: 600, fontSize: "0.95rem", cursor: submitting ? "default" : "pointer" }}>
                {submitting ? "…" : t.listBtn}
              </button>
            </div>
          </div>
        )}

        {/* POST */}
        {tab === "post" && (
          <div style={{ maxWidth: 520 }}>
            <h2 style={{ margin: "0 0 1.5rem", fontSize: "1rem", fontWeight: 600 }}>{t.postTitle}</h2>
            {[
              ["title", t.wantedNameField, "text", t.wantedNamePh],
              ["theatre", t.theatreField, "text", t.wantedTheatrePh],
              ["location", t.locationField, "text", t.wantedLocationPh],
              ["contact", t.contactField, "email", t.wantedContactPh],
            ].map(([key, label, type, placeholder]) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={lbl}>{label}</label>
                <input type={type} value={wantedForm[key]} onChange={e => setWantedForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} style={inp}
                  onFocus={e => e.target.style.borderColor = "#111"} onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              </div>
            ))}
            <div style={{ marginTop: "1.5rem" }}>
              <button onClick={handleWanted} disabled={submitting}
                style={{ padding: "0.7rem 2.5rem", background: submitting ? "#9ca3af" : "#111", color: "#fff", border: "none", borderRadius: 8, fontFamily: "inherit", fontWeight: 600, fontSize: "0.95rem", cursor: submitting ? "default" : "pointer" }}>
                {submitting ? "…" : t.postBtn}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 440, width: "100%", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}>
            <button onClick={() => setModal(null)} style={{ position: "absolute", top: 12, right: 14, background: "rgba(255,255,255,0.9)", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "0.9rem", borderRadius: 6, padding: "0.25rem 0.5rem", zIndex: 1 }}>✕</button>

            {modal.photo_url ? (
              <img src={modal.photo_url} alt={modal.title} style={{ width: "100%", height: 200, objectFit: "cover" }} />
            ) : (
              <div style={{ padding: "1.75rem 1.75rem 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{modal.image}</div>
              </div>
            )}

            <div style={{ padding: modal.photo_url ? "1.25rem 1.75rem 1.75rem" : "0 1.75rem 1.75rem" }}>
              <h2 style={{ margin: "0 0 0.6rem", fontSize: "1rem", fontWeight: 700, lineHeight: 1.45 }}>{modal.title}</h2>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.85rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.65rem", padding: "3px 9px", borderRadius: 20, background: "#f3f4f6", color: "#374151" }}>
                  {t.categories[t.catKeys.indexOf(modal.category)] || modal.category}
                </span>
                <span style={{ fontSize: "0.65rem", padding: "3px 9px", borderRadius: 20, background: conditionBg(modal.condition), color: conditionColor(modal.condition), fontWeight: 600 }}>
                  {t.conditions[modal.condition] || modal.condition}
                </span>
                <span style={{ fontSize: "0.65rem", padding: "3px 9px", borderRadius: 20, background: modal.available ? "#f0fdf4" : "#fef2f2", color: modal.available ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                  {modal.available ? t.available : t.onLoan}
                </span>
              </div>

              {/* 費用・配送 */}
              <div style={{ background: "#f9fafb", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "0.85rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: "0 0 0.1rem", fontSize: "0.7rem", color: "#9ca3af" }}>{t.priceLabel.split("（")[0]}</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: modal.price === 0 ? "#16a34a" : "#111" }}>
                    {modal.price === 0 ? t.free : `¥${(modal.price||0).toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <p style={{ margin: "0 0 0.1rem", fontSize: "0.7rem", color: "#9ca3af" }}>{t.shippableLabel}</p>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.88rem", color: modal.shippable ? "#2563eb" : "#9ca3af" }}>
                    {modal.shippable ? `🚚 ${t.shippingFeeDisplay(modal.shipping_fee || 0)}` : `🏛 ${t.shippingNA}`}
                  </p>
                </div>
              </div>

              <p style={{ color: "#374151", fontSize: "0.83rem", marginBottom: "0.3rem" }}>🏛 {modal.theatre}</p>
              <p style={{ color: "#9ca3af", fontSize: "0.83rem", margin: 0 }}>📍 {modal.location}</p>
              {modal.description && (
                <p style={{ color: "#6b7280", fontSize: "0.83rem", lineHeight: 1.7, margin: "1rem 0", padding: "1rem 0", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
                  {modal.description}
                </p>
              )}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: modal.description ? 0 : "1rem" }}>
                <a href={`mailto:${modal.contact}`} style={{ flex: 1, textAlign: "center", padding: "0.6rem 1rem", background: "#111", color: "#fff", borderRadius: 8, fontSize: "0.83rem", textDecoration: "none", fontFamily: "inherit", fontWeight: 600 }}>
                  📧 {t.contactTheatre}
                </a>
                <button onClick={() => { toggleAvailable(modal); setModal(null); }} style={{ padding: "0.6rem 1rem", background: "#fff", color: "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "inherit", fontSize: "0.83rem", cursor: "pointer" }}>
                  {modal.available ? t.markOnLoan : t.markAvailable}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "0.7rem 1.4rem", borderRadius: 8, fontWeight: 500, fontSize: "0.85rem", zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
