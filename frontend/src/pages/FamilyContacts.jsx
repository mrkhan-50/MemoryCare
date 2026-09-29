import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FamilyContacts() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem("memorycare_user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  });

  const storageKey = user
    ? `memorycare_family_contacts_${user.id}`
    : "memorycare_family_contacts";

  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem(
        user
          ? `memorycare_family_contacts_${user.id}`
          : "memorycare_family_contacts"
      );

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [relationship, setRelationship] =
    useState("");
  const [phone, setPhone] = useState("");

  // ==========================================
  // SAVE CONTACTS
  // ==========================================

  const saveContacts = (updatedContacts) => {
    setContacts(updatedContacts);

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedContacts)
    );
  };

  // ==========================================
  // ADD CONTACT
  // ==========================================

  const handleAddContact = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter the person's name.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter a phone number.");
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, "");

    if (!/^[+]?[0-9]{10,15}$/.test(cleanPhone)) {
      alert(
        "Please enter a valid phone number."
      );
      return;
    }

    const newContact = {
      id: Date.now(),
      name: name.trim(),
      relationship:
        relationship.trim() || "Family Member",
      phone: cleanPhone,
    };

    const updatedContacts = [
      ...contacts,
      newContact,
    ];

    saveContacts(updatedContacts);

    setName("");
    setRelationship("");
    setPhone("");
    setShowForm(false);
  };

  // ==========================================
  // DELETE CONTACT
  // ==========================================

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this contact?"
    );

    if (!confirmed) return;

    const updatedContacts =
      contacts.filter(
        (contact) => contact.id !== id
      );

    saveContacts(updatedContacts);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("memorycare_user");
    navigate("/login");
  };

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={loadingCard}>
          <h2 style={{ color: "#172554" }}>
            Please sign in first.
          </h2>

          <button
            onClick={() => navigate("/login")}
            style={primaryButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>

      {/* ======================================
          HEADER
      ====================================== */}

      <header style={headerStyle}>

        <div style={brandContainer}>

          <div style={brandIcon}>
            🧠
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#172554",
              }}
            >
              MemoryCare
            </h2>

            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Memory & Family
            </span>
          </div>

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >

          <button
            onClick={() =>
              navigate("/patient")
            }
            style={backButton}
          >
            ← Dashboard
          </button>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                color: "#1e293b",
              }}
            >
              {user.name}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              Patient
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={logoutButton}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main style={mainStyle}>

        {/* HERO */}

        <section style={heroStyle}>

          <div>

            <p
              style={{
                margin: "0 0 8px",
                opacity: 0.9,
              }}
            >
              👨‍👩‍👧 Memory & Family
            </p>

            <h1
              style={{
                margin: "0 0 10px",
                fontSize: "34px",
              }}
            >
              Important People
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "650px",
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              Keep your trusted family members
              and important contacts in one
              easy-to-access place.
            </p>

          </div>

          <div
            style={{
              fontSize: "70px",
            }}
          >
            ❤️
          </div>

        </section>

        {/* ADD CONTACT */}

        <section style={addCard}>

          <div>

            <h2
              style={{
                margin: "0 0 7px",
                color: "#172554",
              }}
            >
              Family & Important Contacts
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
              }}
            >
              Add people you trust so their
              phone numbers are easy to find.
            </p>

          </div>

          <button
            onClick={() =>
              setShowForm(!showForm)
            }
            style={addButton}
          >
            {showForm
              ? "✕ Close"
              : "＋ Add Contact"}
          </button>

        </section>

        {/* ====================================
            ADD CONTACT FORM
        ==================================== */}

        {showForm && (
          <section style={formCard}>

            <h3
              style={{
                marginTop: 0,
                color: "#172554",
              }}
            >
              Add Important Person
            </h3>

            <form onSubmit={handleAddContact}>

              <div style={formGrid}>

                {/* NAME */}

                <div>
                  <label style={labelStyle}>
                    Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="e.g. Rahul Kumar"
                    style={inputStyle}
                  />
                </div>

                {/* RELATIONSHIP */}

                <div>
                  <label style={labelStyle}>
                    Relationship
                  </label>

                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) =>
                      setRelationship(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Son, Daughter, Brother"
                    style={inputStyle}
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label style={labelStyle}>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="e.g. 9876543210"
                    style={inputStyle}
                  />
                </div>

              </div>

              <button
                type="submit"
                style={saveButton}
              >
                💾 Save Contact
              </button>

            </form>

          </section>
        )}

        {/* ====================================
            CONTACT LIST
        ==================================== */}

        <section>

          <div
            style={{
              marginBottom: "18px",
            }}
          >

            <h2
              style={{
                margin: 0,
                color: "#172554",
              }}
            >
              Your Important People
            </h2>

            <p
              style={{
                marginTop: "6px",
                color: "#64748b",
              }}
            >
              {contacts.length === 0
                ? "No contacts added yet."
                : `${contacts.length} contact${
                    contacts.length > 1
                      ? "s"
                      : ""
                  } saved`}
            </p>

          </div>

          {contacts.length === 0 ? (

            <div style={emptyCard}>

              <div
                style={{
                  fontSize: "55px",
                  marginBottom: "10px",
                }}
              >
                👨‍👩‍👧
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#172554",
                }}
              >
                No family contacts yet
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                }}
              >
                Add a trusted family member or
                important person to get started.
              </p>

            </div>

          ) : (

            <div style={contactsGrid}>

              {contacts.map((contact) => (

                <div
                  key={contact.id}
                  style={contactCard}
                >

                  <div style={contactTop}>

                    <div style={personIcon}>
                      👤
                    </div>

                    <div
                      style={{
                        flex: 1,
                      }}
                    >

                      <h3
                        style={{
                          margin: "0 0 4px",
                          color: "#172554",
                        }}
                      >
                        {contact.name}
                      </h3>

                      <div
                        style={{
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        {contact.relationship}
                      </div>

                    </div>

                  </div>

                  <div style={phoneBox}>
                    📞 {contact.phone}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "15px",
                    }}
                  >

                    <a
                      href={`tel:${contact.phone}`}
                      style={callButton}
                    >
                      📞 Call
                    </a>

                    <button
                      onClick={() =>
                        handleDelete(contact.id)
                      }
                      style={deleteButton}
                    >
                      🗑️ Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* SAFETY NOTE */}

        <section style={safetyCard}>

          <div
            style={{
              fontSize: "38px",
            }}
          >
            💙
          </div>

          <div>

            <h3
              style={{
                margin: "0 0 7px",
                color: "#172554",
              }}
            >
              Keep trusted contacts updated
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Add only people you trust and make
              sure their phone numbers are correct.
              This information is stored locally
              on this device in the current version.
            </p>

          </div>

        </section>

      </main>
    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #eef7ff 0%, #f4fbf7 100%)",
  fontFamily:
    "Arial, Helvetica, sans-serif",
};

const headerStyle = {
  background: "white",
  padding: "18px 35px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.06)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const brandContainer = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const brandIcon = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "27px",
};

const backButton = {
  border: "none",
  background: "#eef4ff",
  color: "#2563eb",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const logoutButton = {
  border: "none",
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const mainStyle = {
  maxWidth: "1150px",
  margin: "0 auto",
  padding: "35px 25px 50px",
};

const heroStyle = {
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  borderRadius: "24px",
  padding: "32px 35px",
  marginBottom: "25px",
  boxShadow:
    "0 10px 30px rgba(37,99,235,0.22)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
};

const addCard = {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  marginBottom: "20px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
};

const addButton = {
  border: "none",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const formCard = {
  background: "white",
  borderRadius: "20px",
  padding: "25px",
  marginBottom: "30px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#334155",
  fontWeight: "bold",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid #dbe3ef",
  borderRadius: "10px",
  outline: "none",
  fontSize: "15px",
};

const saveButton = {
  border: "none",
  background: "#16a34a",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const contactsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const contactCard = {
  background: "white",
  borderRadius: "20px",
  padding: "22px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const contactTop = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const personIcon = {
  width: "55px",
  height: "55px",
  borderRadius: "15px",
  background: "#eef4ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "27px",
};

const phoneBox = {
  marginTop: "18px",
  padding: "12px",
  background: "#f8fafc",
  borderRadius: "10px",
  color: "#334155",
  fontWeight: "bold",
};

const callButton = {
  flex: 1,
  textAlign: "center",
  textDecoration: "none",
  background: "#dcfce7",
  color: "#15803d",
  padding: "11px",
  borderRadius: "9px",
  fontWeight: "bold",
};

const deleteButton = {
  border: "none",
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "11px 13px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "bold",
};

const emptyCard = {
  background: "white",
  borderRadius: "20px",
  padding: "45px 25px",
  textAlign: "center",
  marginBottom: "30px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const safetyCard = {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  display: "flex",
  alignItems: "flex-start",
  gap: "18px",
  boxShadow:
    "0 6px 25px rgba(0,0,0,0.06)",
};

const primaryButton = {
  border: "none",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const loadingCard = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow:
    "0 8px 30px rgba(0,0,0,0.08)",
};

export default FamilyContacts;