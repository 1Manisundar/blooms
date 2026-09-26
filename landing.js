/**
 * Bloom Landing Page v2 — Interactive enhancements
 * Progressive enhancement, zero external dependencies, accessible.
 */
(function () {
  'use strict';

  // -------------------------------------------------------------------
  // 1. Theme Management
  // -------------------------------------------------------------------
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  function isDark() {
    const attr = root.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function syncThemeUI() {
    const dark = isDark();
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      const moon = themeBtn.querySelector('.icon-moon');
      const sun = themeBtn.querySelector('.icon-sun');
      if (moon && sun) {
        moon.style.display = dark ? 'none' : 'inline-block';
        sun.style.display = dark ? 'inline-block' : 'none';
      }
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('bloom.theme', next);
      } catch (e) {}
      syncThemeUI();
    });
  }
  syncThemeUI();

  // -------------------------------------------------------------------
  // 2. Sticky Header Hairline & Scroll Spy
  // -------------------------------------------------------------------
  const header = document.getElementById('header');
  const sentinel = document.getElementById('top-sentinel');

  if (window.IntersectionObserver && header && sentinel) {
    const headerObs = new IntersectionObserver(function (entries) {
      const entry = entries[0];
      if (entry.isIntersecting) {
        header.classList.remove('is-scrolled');
      } else {
        header.classList.add('is-scrolled');
      }
    }, { threshold: [0] });
    headerObs.observe(sentinel);
  }

  // Scroll Spy on Main Sections
  const navLinks = document.querySelectorAll('.site-nav .nav-item, .mobile-nav__link');
  const sections = document.querySelectorAll('section[id]');

  if (window.IntersectionObserver && sections.length && navLinks.length) {
    const sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + id) {
              link.setAttribute('aria-current', 'true');
            } else if (href && href.startsWith('#') && href !== '#' + id) {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(function (sec) { sectionObs.observe(sec); });
  }

  // -------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // -------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobileNav() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function openMobileNav() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation menu');
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close on navigation link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on Escape key
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileNav.hidden) {
        closeMobileNav();
        menuToggle.focus();
      }
    });
  }

  // -------------------------------------------------------------------
  // 4. Hero Mirror Chips
  // -------------------------------------------------------------------
  const heroChips = document.querySelectorAll('#hero-mirror-chips .chip--interactive');
  const heroNoted = document.getElementById('hero-mirror-noted');

  heroChips.forEach(function (btn) {
    btn.addEventListener('click', function () {
      heroChips.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      if (heroNoted) {
        heroNoted.style.opacity = '1';
      }
    });
  });

  // -------------------------------------------------------------------
  // 5. Ask Section (Interactive Proof with Citations)
  // -------------------------------------------------------------------
  const ASK_DATA = {
    q1: {
      question: "How does the Calvin cycle fix carbon?",
      answerHtml: 'In the stroma of the chloroplast, the enzyme RuBisCO attaches CO₂ to a five-carbon sugar, RuBP <a href="#src-1" class="cite" data-src="src-1" aria-label="Source 1: Campbell Biology">1</a>. The unstable six-carbon product splits at once into two molecules of 3-PGA, which are reduced to G3P using ATP and NADPH from the light reactions <a href="#src-2" class="cite" data-src="src-2" aria-label="Source 2: The Calvin cycle Khan Academy">2</a>. For every three CO₂ fixed, one G3P leaves the cycle to build sugars; the rest regenerates RuBP so the cycle can turn again <a href="#src-1" class="cite" data-src="src-1" aria-label="Source 1: Campbell Biology">1</a><a href="#src-3" class="cite" data-src="src-3" aria-label="Source 3: Your note">3</a>.',
      groundingText: "Grounded in 3 of your sources",
      groundingWeak: false,
      sources: [
        { id: "src-1", n: "1", title: "Campbell Biology — ch. 10, Photosynthesis", meta: "Kindle highlight · 3 weeks ago", cited: true },
        { id: "src-2", n: "2", title: "The Calvin cycle — Khan Academy", meta: "Article · 12 days ago", cited: false },
        { id: "src-3", n: "3", title: "Your note: Why 3 CO₂ per G3P?", meta: "Markdown · 5 days ago", cited: false }
      ]
    },
    q2: {
      question: "Why is RuBisCO so slow?",
      answerHtml: 'RuBisCO fixes only a few CO₂ molecules per second — slow for an enzyme <a href="#src-1" class="cite" data-src="src-1" aria-label="Source 1: RuBisCO Wikipedia">1</a>. It also mistakes O₂ for CO₂, triggering wasteful photorespiration, especially in heat <a href="#src-2" class="cite" data-src="src-2" aria-label="Source 2: Campbell Biology">2</a>. Plants compensate by making enormous amounts of it; it\'s often called the most abundant protein on Earth <a href="#src-1" class="cite" data-src="src-1" aria-label="Source 1: RuBisCO Wikipedia">1</a>.',
      groundingText: "Grounded in 2 of your sources",
      groundingWeak: false,
      sources: [
        { id: "src-1", n: "1", title: "RuBisCO — Wikipedia", meta: "Article · 2 weeks ago", cited: true },
        { id: "src-2", n: "2", title: "Campbell Biology — ch. 10, Photosynthesis", meta: "Kindle highlight · 3 weeks ago", cited: false }
      ]
    },
    q3: {
      question: "What does entropy have to do with life?",
      answerHtml: 'Living things don\'t break the second law — they\'re open systems that stay ordered by exporting entropy to their surroundings <a href="#src-1" class="cite" data-src="src-1" aria-label="Source 1: Feynman Lectures">1</a>. Plants do it with sunlight: they absorb low-entropy light and release high-entropy heat, and use the difference to build sugars <a href="#src-2" class="cite" data-src="src-2" aria-label="Source 2: Your note">2</a>. Schrödinger called this feeding on \'negative entropy\' <a href="#src-3" class="cite" data-src="src-3" aria-label="Source 3: What Is Life?">3</a>.',
      groundingText: "Grounded in 3 of your sources",
      groundingWeak: false,
      sources: [
        { id: "src-1", n: "1", title: "The Feynman Lectures on Physics — Vol. I, ch. 44", meta: "Book · 1 month ago", cited: true },
        { id: "src-2", n: "2", title: "Your note: Photosynthesis as an entropy pump", meta: "Markdown · 9 days ago", cited: false },
        { id: "src-3", n: "3", title: "What Is Life? — Erwin Schrödinger", meta: "Kindle highlight · 1 month ago", cited: false }
      ]
    },
    q4: {
      question: "What did I read about CRISPR?",
      answerHtml: 'I couldn\'t find anything about CRISPR in your library, so I won\'t guess. Want me to suggest a few trusted sources to add?',
      groundingText: "No supporting sources found",
      groundingWeak: true,
      sources: []
    }
  };

  const askTabs = document.querySelectorAll('.ask-tabs button');
  const askQuestionHead = document.getElementById('ask-question-head');
  const askAnswerBody = document.getElementById('ask-answer-body');
  const askGrounding = document.getElementById('ask-grounding');
  const askGroundingText = document.getElementById('ask-grounding-text');
  const askSources = document.getElementById('ask-sources');
  const askMissAction = document.getElementById('ask-miss-action');
  const askTyping = document.getElementById('ask-typing');
  const askPanel = document.getElementById('ask-panel');

  function renderAskContent(qid) {
    const data = ASK_DATA[qid];
    if (!data) return;

    if (askQuestionHead) askQuestionHead.textContent = data.question;
    if (askAnswerBody) askAnswerBody.innerHTML = data.answerHtml;

    if (askGrounding && askGroundingText) {
      askGroundingText.textContent = data.groundingText;
      if (data.groundingWeak) {
        askGrounding.classList.add('grounding--weak');
        askGrounding.querySelector('use').setAttribute('href', '#i-alert');
      } else {
        askGrounding.classList.remove('grounding--weak');
        askGrounding.querySelector('use').setAttribute('href', '#i-check');
      }
    }

    if (askSources) {
      if (data.sources.length === 0) {
        askSources.innerHTML = '<div class="empty-state text-sm text-muted" style="padding:1rem;background:hsl(var(--card));border:1px dashed hsl(var(--border));border-radius:var(--radius-md);text-align:center">Nothing in your library yet.</div>';
      } else {
        askSources.innerHTML = data.sources.map(function (s) {
          const citedCls = s.cited ? ' is-cited' : '';
          return '<div class="source' + citedCls + '" id="' + s.id + '" tabindex="0">' +
                 '<span class="source__n">' + s.n + '</span>' +
                 '<div class="source__body">' +
                 '<span class="source__title">' + s.title + '</span>' +
                 '<span class="source__meta">' + s.meta + '</span>' +
                 '</div>' +
                 '</div>';
        }).join('');
      }
    }

    if (askMissAction) {
      askMissAction.hidden = (data.sources.length > 0);
    }

    wireCitations();
  }

  function wireCitations() {
    const pills = document.querySelectorAll('#ask-answer-body .cite');
    const sourceCards = document.querySelectorAll('#ask-sources .source');

    pills.forEach(function (pill) {
      const srcId = pill.getAttribute('data-src');

      pill.addEventListener('mouseenter', function () {
        const target = document.getElementById(srcId);
        if (target) target.classList.add('is-cited');
      });
      pill.addEventListener('mouseleave', function () {
        const target = document.getElementById(srcId);
        if (target && !target.classList.contains('is-pinned')) {
          // keep first source as default cited only on q1
          if (srcId !== 'src-1') target.classList.remove('is-cited');
        }
      });
      pill.addEventListener('focus', function () {
        const target = document.getElementById(srcId);
        if (target) target.classList.add('is-cited');
      });
      pill.addEventListener('blur', function () {
        const target = document.getElementById(srcId);
        if (target && srcId !== 'src-1') target.classList.remove('is-cited');
      });

      pill.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.getElementById(srcId);
        if (target) {
          sourceCards.forEach(function (c) { c.classList.remove('is-cited', 'is-pulse'); });
          target.classList.add('is-cited', 'is-pulse');
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          target.focus();
        }
      });
    });

    sourceCards.forEach(function (card) {
      const id = card.id;
      card.addEventListener('mouseenter', function () {
        pills.forEach(function (p) {
          if (p.getAttribute('data-src') === id) p.classList.add('is-active');
        });
      });
      card.addEventListener('mouseleave', function () {
        pills.forEach(function (p) {
          if (p.getAttribute('data-src') === id) p.classList.remove('is-active');
        });
      });
    });
  }

  askTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const qid = tab.getAttribute('data-qid');
      if (tab.classList.contains('is-active')) return;

      askTabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        renderAskContent(qid);
      } else {
        if (askTyping) askTyping.hidden = false;
        if (askPanel) askPanel.style.opacity = '0.35';
        setTimeout(function () {
          renderAskContent(qid);
          if (askTyping) askTyping.hidden = true;
          if (askPanel) askPanel.style.opacity = '1';
        }, 450);
      }
    });
  });

  const btnSuggest = document.getElementById('btn-suggest-sources');
  if (btnSuggest) {
    btnSuggest.addEventListener('click', function () {
      alert("In the Bloom app, suggested sources arrive in your inbox for your review and approval.");
    });
  }

  wireCitations();

  // -------------------------------------------------------------------
  // 6. Interactive Graph (Library Section)
  // -------------------------------------------------------------------
  const graph = document.getElementById('landing-graph');
  if (graph) {
    const nodes = graph.querySelectorAll('.graph__node');
    const edges = graph.querySelectorAll('.graph__edges line');

    const nodeConnections = {
      'gn-calvin': ['gn-photo', 'gn-rubisco', 'gn-atp', 'gn-carbon', 'gn-src1', 'gn-src2'],
      'gn-photo': ['gn-calvin', 'gn-light'],
      'gn-rubisco': ['gn-calvin', 'gn-photoresp', 'gn-q1'],
      'gn-atp': ['gn-calvin'],
      'gn-carbon': ['gn-calvin', 'gn-climate'],
      'gn-photoresp': ['gn-rubisco'],
      'gn-light': ['gn-photo'],
      'gn-src1': ['gn-calvin'],
      'gn-src2': ['gn-calvin'],
      'gn-q1': ['gn-rubisco'],
      'gn-climate': ['gn-carbon']
    };

    function highlightNode(nodeId) {
      graph.classList.add('has-focus');
      const related = nodeConnections[nodeId] || [];

      nodes.forEach(function (n) {
        if (n.id === nodeId) {
          n.classList.add('is-active');
        } else if (related.indexOf(n.id) !== -1) {
          n.classList.add('is-related');
        } else {
          n.classList.remove('is-active', 'is-related');
        }
      });

      edges.forEach(function (edge) {
        const edgeData = (edge.getAttribute('data-e') || '').split(',');
        const shortId = nodeId.replace('gn-', 'n-');
        const match = edgeData.some(function (d) { return d === shortId; });
        if (match) {
          edge.classList.add('is-related');
        } else {
          edge.classList.remove('is-related');
        }
      });
    }

    function clearHighlight() {
      graph.classList.remove('has-focus');
      nodes.forEach(function (n) { n.classList.remove('is-active', 'is-related'); });
      edges.forEach(function (e) { e.classList.remove('is-related'); });
    }

    nodes.forEach(function (n) {
      n.addEventListener('mouseenter', function () { highlightNode(n.id); });
      n.addEventListener('mouseleave', clearHighlight);
      n.addEventListener('focus', function () { highlightNode(n.id); });
      n.addEventListener('blur', clearHighlight);
    });
  }

  // -------------------------------------------------------------------
  // 7. Practice Flashcard Loop
  // -------------------------------------------------------------------
  const CARDS = [
    {
      concept: "RuBisCO",
      question: "What does RuBisCO attach CO₂ to?",
      answer: "RuBP (ribulose-1,5-bisphosphate), a five-carbon sugar.",
      source: "From Campbell Biology, ch. 10"
    },
    {
      concept: "Entropy",
      question: "Why don't living things violate the second law of thermodynamics?",
      answer: "They're open systems: they stay ordered by exporting entropy to their surroundings.",
      source: "From The Feynman Lectures on Physics, Vol. I, ch. 44"
    },
    {
      concept: "Bayes' theorem",
      question: "In Bayes' theorem, what does P(A | B) mean?",
      answer: "The probability of A given that B is true — your updated belief after seeing B.",
      source: "From 3Blue1Brown — The geometry of changing beliefs"
    }
  ];

  let cardIndex = 0;
  const flashcard = document.getElementById('landing-flashcard');
  const btnShowAnswer = document.getElementById('btn-show-answer');
  const cardConcept = document.getElementById('card-concept');
  const cardConceptBack = document.getElementById('card-concept-back');
  const cardQuestion = document.getElementById('card-question');
  const cardAnswer = document.getElementById('card-answer');
  const cardSource = document.getElementById('card-source');
  const cardCounter = document.getElementById('flashcard-counter');
  const gradeButtons = document.querySelectorAll('.card-grade-btn');

  function renderCard(idx) {
    const card = CARDS[idx];
    if (!card) return;
    if (cardConcept) cardConcept.textContent = card.concept;
    if (cardConceptBack) cardConceptBack.textContent = card.concept;
    if (cardQuestion) cardQuestion.textContent = card.question;
    if (cardAnswer) cardAnswer.textContent = card.answer;
    if (cardSource) cardSource.textContent = card.source;
    if (cardCounter) cardCounter.textContent = 'Card ' + (idx + 1) + ' of ' + CARDS.length;
  }

  function flipCard() {
    if (!flashcard) return;
    flashcard.classList.toggle('is-flipped');
  }

  function nextCard() {
    if (!flashcard) return;
    flashcard.classList.remove('is-flipped');
    setTimeout(function () {
      cardIndex = (cardIndex + 1) % CARDS.length;
      renderCard(cardIndex);
    }, 200);
  }

  if (btnShowAnswer) {
    btnShowAnswer.addEventListener('click', flipCard);
  }

  gradeButtons.forEach(function (btn) {
    btn.addEventListener('click', nextCard);
  });

  if (flashcard) {
    flashcard.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (!flashcard.classList.contains('is-flipped')) {
          e.preventDefault();
          flipCard();
        }
      } else if (['1', '2', '3', '4'].indexOf(e.key) !== -1) {
        if (flashcard.classList.contains('is-flipped')) {
          e.preventDefault();
          nextCard();
        }
      }
    });
  }

  // -------------------------------------------------------------------
  // 8. Waitlist Form Submission & Validation
  // -------------------------------------------------------------------
  function setupWaitlistForm(formId, successId, errId, emailInputId, groupWrapId) {
    const form = document.getElementById(formId);
    const successWrap = document.getElementById(successId);
    const errBox = document.getElementById(errId);
    const emailInput = document.getElementById(emailInputId);
    const groupWrap = document.getElementById(groupWrapId);

    if (!form || !emailInput) return;

    // Check if user already joined
    try {
      const savedEmail = localStorage.getItem('bloom.waitlist');
      if (savedEmail && successWrap) {
        form.hidden = true;
        successWrap.hidden = false;
        const emailSpan = successWrap.querySelector('.wl-success-email');
        if (emailSpan) emailSpan.textContent = savedEmail;
      }
    } catch (e) {}

    function showError(msg) {
      if (!errBox || !groupWrap) return;
      errBox.hidden = false;
      const errText = errBox.querySelector('.field-error__text') || errBox;
      errText.textContent = msg;
      groupWrap.setAttribute('aria-invalid', 'true');
      emailInput.setAttribute('aria-describedby', errId);
    }

    function clearError() {
      if (!errBox || !groupWrap) return;
      errBox.hidden = true;
      groupWrap.removeAttribute('aria-invalid');
      emailInput.removeAttribute('aria-describedby');
    }

    emailInput.addEventListener('input', function () {
      if (groupWrap.getAttribute('aria-invalid') === 'true') {
        clearError();
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Check honeypot
      const hp = form.querySelector('input[name="hp_confirm"]');
      if (hp && hp.value) return;

      const email = (emailInput.value || '').trim();
      if (!email) {
        showError('Enter your email address.');
        emailInput.focus();
        return;
      }

      // Email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!re.test(email)) {
        showError("That doesn't look like an email address.");
        emailInput.focus();
        return;
      }

      clearError();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.setAttribute('aria-busy', 'true');

      function finishSuccess() {
        if (submitBtn) submitBtn.removeAttribute('aria-busy');
        form.hidden = true;
        if (successWrap) {
          successWrap.hidden = false;
          const emailSpan = successWrap.querySelector('.wl-success-email');
          if (emailSpan) emailSpan.textContent = email;
        }
        try {
          localStorage.setItem('bloom.waitlist', email);
        } catch (err) {}
      }

      if (form.dataset.endpoint) {
        fetch(form.dataset.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, source: 'landing' })
        })
        .then(function (res) {
          if (res.ok) finishSuccess();
          else showError('Could not join waitlist. Please try again.');
        })
        .catch(function () {
          showError('Network error. Please try again.');
        })
        .finally(function () {
          if (submitBtn) submitBtn.removeAttribute('aria-busy');
        });
      } else {
        // Simulated submission
        setTimeout(finishSuccess, 700);
      }
    });

    // Reset button
    if (successWrap) {
      const resetBtn = successWrap.querySelector('.wl-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          try {
            localStorage.removeItem('bloom.waitlist');
          } catch (e) {}
          successWrap.hidden = true;
          form.hidden = false;
          emailInput.value = '';
          emailInput.focus();
        });
      }
    }
  }

  setupWaitlistForm('join', 'wl-success-hero', 'wl-err-hero', 'wl-email-hero', 'wl-group-hero');
  setupWaitlistForm('join-final', 'wl-success-final', 'wl-err-final', 'wl-email-final', 'wl-group-final');

  // -------------------------------------------------------------------
  // 9. Reveal Animations via IntersectionObserver
  // -------------------------------------------------------------------
  if (window.IntersectionObserver) {
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(function (el) { revealObs.observe(el); });
  }

})();
