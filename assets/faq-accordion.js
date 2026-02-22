(function() {
  'use strict';

  function initFAQAccordion(sectionId) {
    const section = document.querySelector(`.faq-accordion[data-section-id="${sectionId}"]`);
    if (!section) return;

    const container = section.querySelector('.faq-accordion__items');
    if (!container) return;

    const allowMultiple = container.dataset.allowMultiple === 'true';

    // Clean up existing listeners
    const buttons = section.querySelectorAll('.faq-item__question');
    buttons.forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });

    // Add new listeners
    section.querySelectorAll('.faq-item__question').forEach(button => {
      button.addEventListener('click', handleClick);
      button.addEventListener('keydown', handleKeydown);
    });

    function handleClick(e) {
      const button = e.currentTarget;
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      if (!allowMultiple) {
        section.querySelectorAll('.faq-item__question').forEach(btn => {
          if (btn !== button) {
            btn.setAttribute('aria-expanded', 'false');
            const answer = btn.nextElementSibling;
            if (answer) {
              answer.hidden = true;
            }
          }
        });
      }

      button.setAttribute('aria-expanded', !isExpanded);
      const answer = button.nextElementSibling;
      if (answer) {
        answer.hidden = isExpanded;
      }
    }

    function handleKeydown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    }
  }

  function cleanupFAQAccordion(sectionId) {
    const section = document.querySelector(`.faq-accordion[data-section-id="${sectionId}"]`);
    if (!section) return;

    const buttons = section.querySelectorAll('.faq-item__question');
    buttons.forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });
  }

  // Initialize on load
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.faq-accordion').forEach(section => {
      const sectionId = section.dataset.sectionId;
      if (sectionId) {
        initFAQAccordion(sectionId);
      }
    });
  });

  // Theme Editor events
  document.addEventListener('shopify:section:load', function(e) {
    initFAQAccordion(e.detail.sectionId);
  });

  document.addEventListener('shopify:section:unload', function(e) {
    cleanupFAQAccordion(e.detail.sectionId);
  });
})();