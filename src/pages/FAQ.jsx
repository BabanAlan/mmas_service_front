import React, { useState, useRef, useEffect } from "react";
import { CgChevronRight } from "react-icons/cg";
import "../styles/faq.css";
import faqs from "../data/FaqData.jsx";

export default function FAQ() {
  
  const [openId, setOpenId] = useState(null);
  const contentRefs = useRef({});

  const toggleFAQ = (id) => {
    setOpenId(prevId => (prevId === id ? null : id));
  };

  useEffect(() => {
    Object.keys(contentRefs.current).forEach(id => {
      const el = contentRefs.current[id];
      if (el) {
        if (parseInt(id) === openId) {
          el.style.maxHeight = el.scrollHeight + "px";
        } else {
          el.style.maxHeight = "0px";
        }
      }
    });
  }, [openId]);

  return (
    <div className="faq-page">
      <h2>Помощь / FAQ</h2>
      {faqs.map(faq => (
        <div 
          key={faq.id} 
          className={`faq-item ${openId === faq.id ? "open" : ""}`}
          onClick={() => toggleFAQ(faq.id)}
        >
          <div className="faq-question">
            <strong>{faq.question}</strong>
            <span className={`arrow ${openId === faq.id ? "rotated" : ""}`}>
              <CgChevronRight />
            </span>
          </div>
          <div 
            className="faq-answer-wrapper" 
            ref={el => (contentRefs.current[faq.id] = el)}
          >
            <p className="faq-answer">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
