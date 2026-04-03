/* ===================================================================
   index.js - Premium Executive Presentation Interactions
   The Wishing Star NPD Strategic Deck
   =================================================================== */

// ==========================================
// 1. ROADMAP DATA
// ==========================================
const roadmapData = {
    'Q2-CONCEPT': {
        tag: 'Q2 - CONCEPT',
        title: 'FORMULATION STRATEGY',
        points: [
            'Securing clean-beauty INCI (Tranexamic Acid + Niacinamide) to guarantee mass retail adoption.',
            'Leveraging dermatological efficacy data for post-blemish healing claims.',
            'Running accelerated stability studies on active-heavy formulations.',
            'Mapping competitive white-space against existing PIH products in clean beauty.'
        ],
        competition: [
            { name: 'Hero Cosmetics', product: 'Micropoint for Dark Spots', img: 'comp_hero.png', key: 'Accessible price, Tranexamic Acid focused.' },
            { name: 'ZitSticka', product: 'Hyperfade', img: 'comp_zitsticka.png', key: 'Premium positioning, multi-active brightening.' },
            { name: 'Peace Out', product: 'Dark Spots Dots', img: 'comp_peaceout.png', key: 'Bold branding, microneedling focused.' }
        ]
    },
    'Q3-VALIDATION': {
        tag: 'Q3 - VALIDATION',
        title: 'RISK MITIGATION',
        points: [
            'Leveraging chemical engineering expertise to front-load MVTR packaging tests.',
            'Preventing micro-dart melting in high-humidity transit routes (Southern US, LATAM).',
            'Validating adhesive performance on diverse skin types and moisture levels.',
            'Stress-testing sterilization protocols for micro-dart carrier sheets.'
        ]
    },
    'Q4-COMPLIANCE': {
        tag: 'Q4 - COMPLIANCE',
        title: 'REGULATORY CLEARANCE',
        points: [
            'Pre-clearing Prop 65 and WERCSmart registrations to eliminate retail PO delays.',
            'Finalizing Ulta Conscious Beauty documentation and retailer-specific SDS packets.',
            'Achieving 100% compliance with global Safety Data Sheet standards.',
            'Building proactive regulatory dossier for future SKU extensions.'
        ]
    },
    'Q1-EXECUTION': {
        tag: 'Q1 - EXECUTION',
        title: 'SUPPLY CHAIN RESILIENCE',
        points: [
            'Validating complex pilot runs for perfect die-cut alignment at scale.',
            'Optimizing COGS via waste reduction and tooling amortization strategies.',
            'Scaling production with dual-sourced packaging for nationwide retail launch.',
            'Implementing automated QC vision systems for micro-dart precision validation.'
        ]
    }
};

// ==========================================
// 2. NAV SCROLL BEHAVIOR
// ==========================================
const topNav = document.getElementById('topNav');

function handleNavScroll() {
    if (window.scrollY > 80) {
        topNav.classList.add('scrolled');
    } else {
        topNav.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// Smooth scroll for nav links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==========================================
// 3. MODAL LOGIC
// ==========================================
const overlay = document.getElementById('modalOverlay');
const tagEl = document.getElementById('modalTag');
const titleEl = document.getElementById('modalTitle');
const listEl = document.getElementById('modalList');
const closeBtn = document.getElementById('modalClose');

function openModal(quarterKey) {
    const d = roadmapData[quarterKey];
    if (!d) return;

    tagEl.textContent = d.tag;
    titleEl.textContent = d.title;
    listEl.innerHTML = d.points.map(p => '<li>' + p + '</li>').join('');

    // Competition section
    const modalContent = document.querySelector('.modal-card');
    let compSection = document.getElementById('modalCompetition');

    if (d.competition) {
        if (!compSection) {
            compSection = document.createElement('div');
            compSection.id = 'modalCompetition';
            compSection.className = 'modal-competition';
            modalContent.appendChild(compSection);
        }
        compSection.innerHTML =
            '<h4 class="comp-header">COMPETITIVE LANDSCAPE</h4>' +
            '<div class="comp-grid">' +
            d.competition.map(c =>
                '<div class="comp-item">' +
                '<img src="' + c.img + '" alt="' + c.name + '">' +
                '<div class="comp-info">' +
                '<strong>' + c.name + '</strong>' +
                '<span>' + c.product + '</span>' +
                '<p>' + c.key + '</p>' +
                '</div>' +
                '</div>'
            ).join('') +
            '</div>';
        compSection.style.display = 'block';
    } else if (compSection) {
        compSection.style.display = 'none';
    }

    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeModal() {
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

// Attach hotspot clicks
document.querySelectorAll('.hotspot-node').forEach(function(node) {
    node.addEventListener('click', function() { openModal(node.dataset.quarter); });
});

// ==========================================
// 4. SCROLL-REVEAL (Intersection Observer)
// ==========================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

revealElements.forEach(function(el) { revealObserver.observe(el); });

// ==========================================
// 5. ANIMATED KPI COUNTERS
// ==========================================
const counters = document.querySelectorAll('.counter');
let countersDone = false;

function animateCounters() {
    if (countersDone) return;
    countersDone = true;

    counters.forEach(function(counter) {
        const target = +counter.dataset.target;
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    });
}

const kpiSection = document.getElementById('kpi-dashboard');
if (kpiSection) {
    const kpiObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounters();
                kpiObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    kpiObserver.observe(kpiSection);
}

// ==========================================
// 6. ROADMAP TRACK ANIMATION
// ==========================================
const roadmapVisual = document.getElementById('roadmapVisual');
if (roadmapVisual) {
    const rmObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                rmObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    rmObserver.observe(roadmapVisual);
}

// ==========================================
// 7. STAGGERED REVEAL FOR MARKET CARDS
// ==========================================
const statCards = document.querySelectorAll('.market-stat-card');
statCards.forEach(function(card, i) {
    card.style.transitionDelay = (i * 0.12) + 's';
});

const clinicalRows = document.querySelectorAll('.clinical-stat-row');
clinicalRows.forEach(function(row, i) {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    row.style.transition = 'opacity 0.5s ease ' + (i * 0.15) + 's, transform 0.5s ease ' + (i * 0.15) + 's';
});

const clinicalObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            clinicalRows.forEach(function(row) {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            });
            clinicalObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const clinicalCard = document.querySelector('.clinical-card');
if (clinicalCard) {
    clinicalObserver.observe(clinicalCard);
}
