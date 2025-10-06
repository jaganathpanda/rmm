import React, { useEffect, useState } from "react";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import Card from "./components/Card/Card";
import TextBlock from "./components/TextBlock/TextBlock";
import PricingPlan from "./components/PricingPlan/PricingPlan";
import { Link } from "react-router-dom";
import { getContent, setContent } from "./ContentCache"; // session/in-memory cache

// --- Configuration for fetching the static file ---
// This path assumes 'cache.json' is in your public folder (or the root of your deployment).
const CACHE_FILE_PATH = "/rmm/cache.json";

const DynamicContent = () => {
  const [content, setLocalContent] = useState(getContent() || []);
  const [loading, setLoading] = useState(!getContent());

  useEffect(() => {
    if (getContent()) return; // Content is already cached in session/in-memory

    setLoading(true);

    // ✅ STATIC FILE FETCH with Robust Error Handling
    fetch(CACHE_FILE_PATH)
      .then(async (response) => {
        if (!response.ok) {
          // If the status is not 200 (e.g., 404), read the error body for debugging
          // This prevents the "body stream already read" error later.
          const errorBody = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Body: ${errorBody}`);
        }
        // Read the JSON stream ONLY if the response is successful (response.ok is true)
        return response.json(); 
      })
      .then((fullResponse) => {
        // The Apps Script generates an object: { lastUpdated: "...", data: [...] }
        // We extract the content array from the 'data' key.
        const normalizedData = fullResponse.data || [];
        
        if (!Array.isArray(normalizedData)) {
             console.warn("JSON structure may be incorrect. Expected an object with a 'data' array.");
        }
        
        setContent(normalizedData); // save to session/in-memory cache
        setLocalContent(normalizedData);
      })
      .catch((error) => {
        console.error("❌ Error fetching static content:", error);
      })
      .finally(() => {
        setLoading(false);
      });
      
  }, []); // Empty dependency array ensures this runs only once after the initial render

  if (loading && !content.length) {
    return <div style={{ textAlign: "center", padding: "50px 0" }}>Loading...</div>;
  }

  // --- RENDERING LOGIC ---
  // Group rows by Type (remains exactly as you defined)
  const groupedContent = [];
  let currentGroup = null;
  content.forEach((item) => {
    if (!currentGroup || currentGroup.type !== item.Type) {
      currentGroup = { type: item.Type, items: [item] };
      groupedContent.push(currentGroup);
    } else {
      currentGroup.items.push(item);
    }
  });

  return (
    <div>
      {groupedContent.map((group, idx) => {
        switch (group.type) {
          case "navbar":
            const logo = group.items[0].Content;
            const links = group.items[0]["Features"]
              .split(",")
              .map((l) => {
                const [text, href] = l.split(":");
                return { text: text.trim(), href: href.trim() };
              });
            return (
              <header key={idx} className="landing-header">
                <div className="logo">{logo}</div>
                <nav className="landing-nav">
                  {links.map((link, lidx) => (
                    <Link
                      key={lidx}
                      to={link.href}
                      className={link.text.toLowerCase().includes("trial") ? "btn-free-trial" : ""}
                    >
                      {link.text}
                    </Link>
                  ))}
                </nav>
              </header>
            );

          case "heroCarousel":
            return <HeroCarousel key={idx} items={group.items} />;

          case "card":
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "20px",
                  margin: "40px 0",
                }}
              >
                {group.items.map((item, cidx) => (
                  <Card
                    key={cidx}
                    image={item["Image URL"]}
                    caption={item["Content"]}
                    link={item["Link/Details"]}
                  />
                ))}
              </div>
            );

          case "textBlock":
            return group.items.map((item, tIdx) => (
              <TextBlock key={tIdx} content={item["Content"]} />
            ));

          case "pricingPlan":
            return (
              <section key={idx} id="pricing" className="plans-container">
                {group.items.map((plan, pIdx) => (
                  <PricingPlan key={pIdx} plan={plan} />
                ))}
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default DynamicContent;