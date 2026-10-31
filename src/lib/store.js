import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'azentio_store.json');

// Initial seed data adhering strictly to the Azentio Hackathon Requirements v1.0
const INITIAL_DATA = {
  users: [
    {
      id: "usr_pub_01",
      name: "Public Visitor",
      email: "visitor@industry-fintech.org",
      persona: "public_visitor",
      roles: ["public_visitor"],
      grants: [],
      tenantId: null,
      tenantName: null,
      avatar: "PV"
    },
    {
      id: "usr_emp_priya",
      name: "Priya Sharma",
      email: "priya.sharma@azentio.com",
      persona: "employee",
      roles: ["employee", "product_owner"],
      grants: ["access_employee_playground", "manage_improvement_ideas", "view_internal_broadcasts"],
      tenantId: "tenant_azentio_internal",
      tenantName: "Azentio Internal",
      department: "Credit Intelligence Squad",
      title: "Senior Product Owner",
      avatar: "PS"
    },
    {
      id: "usr_emp_marcus",
      name: "Marcus Vance",
      email: "marcus.vance@azentio.com",
      persona: "content_publisher",
      roles: ["employee", "content_publisher"],
      grants: ["access_employee_playground", "publish_videos", "manage_cms_banners", "view_internal_broadcasts"],
      tenantId: "tenant_azentio_internal",
      tenantName: "Azentio Internal",
      department: "Corporate Marketing & Media",
      title: "Lead Content Publisher",
      avatar: "MV"
    },
    {
      id: "usr_emp_aisha",
      name: "Aisha Al-Mansoor",
      email: "aisha.almansoor@azentio.com",
      persona: "learning_moderator",
      roles: ["employee", "learning_moderator"],
      grants: ["access_employee_playground", "moderate_learning", "redact_contributions", "publish_shared_learning", "view_internal_broadcasts"],
      tenantId: "tenant_azentio_internal",
      tenantName: "Azentio Internal",
      department: "AI Governance & Collective Trust",
      title: "Lead Learning Moderator",
      avatar: "AA"
    },
    {
      id: "usr_client_apex_david",
      name: "David Chen",
      email: "david.chen@apexbank.com",
      persona: "client_member",
      roles: ["client_member"],
      grants: ["submit_observations", "access_entitled_sandbox", "view_shared_learning"],
      tenantId: "tenant_apex_bank",
      tenantName: "Apex Global Bank",
      title: "VP, Commercial SME Lending",
      avatar: "DC"
    },
    {
      id: "usr_client_apex_sarah",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@apexbank.com",
      persona: "client_admin",
      roles: ["client_member", "client_admin"],
      grants: ["invite_client_users", "manage_client_roles", "submit_observations", "access_entitled_sandbox", "view_shared_learning"],
      tenantId: "tenant_apex_bank",
      tenantName: "Apex Global Bank",
      title: "Head of Digital Operations & Transformation",
      avatar: "SJ"
    },
    {
      id: "usr_client_meridian_tariq",
      name: "Tariq Al-Sayed",
      email: "tariq.alsayed@meridiantrust.com",
      persona: "client_member",
      roles: ["client_member"],
      grants: ["submit_observations", "access_entitled_sandbox", "view_shared_learning"],
      tenantId: "tenant_meridian_trust",
      tenantName: "Meridian Trust",
      title: "Director of Credit Risk & Underwriting",
      avatar: "TA"
    },
    {
      id: "usr_client_gulf_fatima",
      name: "Fatima Zahra",
      email: "fatima.zahra@gulffinancial.com",
      persona: "client_member",
      roles: ["client_member"],
      grants: ["submit_observations", "access_entitled_sandbox", "view_shared_learning"],
      tenantId: "tenant_gulf_financial",
      tenantName: "Gulf Financial Corp",
      title: "Chief Credit Risk Officer",
      avatar: "FZ"
    },
    {
      id: "usr_admin_kiran",
      name: "Kiran Rao",
      email: "kiran.rao@azentio.com",
      persona: "portal_admin",
      roles: ["portal_admin", "employee"],
      grants: ["manage_organisations", "manage_platform_roles", "manage_system_config", "view_audit_logs", "run_federated_coordinator", "access_employee_playground"],
      tenantId: "tenant_azentio_internal",
      tenantName: "Azentio Internal",
      department: "Platform Engineering",
      title: "Portal Infrastructure Administrator",
      avatar: "KR"
    }
  ],

  tenants: [
    {
      id: "tenant_apex_bank",
      name: "Apex Global Bank",
      tier: "Tier-1 International Commercial Bank",
      region: "EMEA / Singapore",
      industry: "Corporate & SME Banking",
      joinedAt: "2026-01-15T09:00:00Z",
      status: "active",
      entitlements: [
        "sme-credit-decisioning",
        "credit-strategy-simulator",
        "financial-analysis-intelligence",
        "riva"
      ],
      memberCount: 14,
      optedInFederatedLearning: true
    },
    {
      id: "tenant_meridian_trust",
      name: "Meridian Trust",
      tier: "Regional Corporate & Investment Banking",
      region: "Middle East / UAE & Saudi Arabia",
      industry: "Trade Finance & Agri-Business",
      joinedAt: "2026-02-10T11:30:00Z",
      status: "active",
      entitlements: [
        "sme-credit-decisioning",
        "riva",
        "financial-analysis-intelligence",
        "islamic-banking-assistant"
      ],
      memberCount: 8,
      optedInFederatedLearning: true
    },
    {
      id: "tenant_gulf_financial",
      name: "Gulf Financial Corp",
      tier: "Specialized SME & Trade Lending Institution",
      region: "GCC / Bahrain & Oman",
      industry: "Commercial Lending & Tourism",
      joinedAt: "2026-03-01T08:15:00Z",
      status: "active",
      entitlements: [
        "sme-credit-decisioning",
        "financial-analysis-intelligence",
        "similar-portfolio-intelligence"
      ],
      memberCount: 6,
      optedInFederatedLearning: true
    }
  ],

  products: [
    {
      slug: "sme-credit-decisioning",
      name: "SME Credit Decisioning",
      category: "Lending & Risk Intelligence",
      tagline: "Autonomous multi-factor underwriting for commercial small-and-medium enterprise facilities.",
      description: "Harness real-time transaction telemetry, alternate financial indicators, and explainable behavioral heuristics to render transparent credit decisions in seconds.",
      capabilities: [
        "Dynamic debt-service coverage ratio (DSCR) simulation",
        "Tax & bank statement ingestion with synthetic cross-validation",
        "Explainable risk weight scorecard with regulatory compliance logs",
        "Automated adverse action and reason code generation"
      ],
      audience: "public",
      status: "production_ready"
    },
    {
      slug: "credit-strategy-simulator",
      name: "Credit Strategy Simulator",
      category: "Risk Optimization",
      tagline: "Stress-test policy adjustments, macroeconomic shocks, and cutoff calibrations.",
      description: "Interactive simulation sandbox that projects portfolio default velocity, capital allocation yields, and expected loss under varying macro scenarios.",
      capabilities: [
        "Monte Carlo macroeconomic trajectory stress testing",
        "Dynamic cutoff boundary optimization across risk tiers",
        "Vintage curve projections and early warning signals",
        "Synthetic benchmark comparison against peer banks"
      ],
      audience: "public",
      status: "production_ready"
    },
    {
      slug: "riva",
      name: "RIVA - Conversational Financial Copilot",
      category: "Generative AI Banking",
      tagline: "Enterprise-grade conversational banking agent powered by governed financial reasoning.",
      description: "RIVA assists relationship managers and credit committees by summarizing complex commercial credit memorandums, balance sheets, and cash flow dynamics.",
      capabilities: [
        "Cites exact document clauses and financial statements",
        "Strict enterprise security sandbox with tenant data isolation",
        "Audit-logged conversational reasoning chains",
        "Multi-lingual corporate banking terminology support"
      ],
      audience: "public",
      status: "production_ready"
    },
    {
      slug: "similar-portfolio-intelligence",
      name: "Similar Portfolio Intelligence",
      category: "Market & Cohort Benchmarking",
      tagline: "De-identified peer cohort comparisons across regional corporate portfolios.",
      description: "Analyze non-identifiable portfolio performance distributions without exposing proprietary borrower data or competitive secrets.",
      capabilities: [
        "Differentially private cohort benchmarking ($k$-anonymity $\\ge 3$)",
        "Sectoral default frequency indexing",
        "Cross-client regional resilience indicators",
        "Suppression of outlier cohorts to preserve contributor privacy"
      ],
      audience: "public",
      status: "production_ready"
    },
    {
      slug: "persona-newsroom",
      name: "Persona Newsroom & Market Sentinel",
      category: "Market Intelligence",
      tagline: "Hyper-curated executive market briefings and regulatory change detection.",
      description: "Synthesizes real-time regulatory releases, central bank circulars, and trade macro indicators tailored to banking personas.",
      capabilities: [
        "Persona-tailored briefing synthesis (CRO, CFO, Head of Lending)",
        "Regulatory compliance delta tracking across jurisdictions",
        "Sentiment shift detection in SME supply chains",
        "Instant briefing export and executive summary packs"
      ],
      audience: "public",
      status: "production_ready"
    }
  ],

  // Collective Learning Hub Observations
  // Implements the scenario from Page 11 of Hackathon Requirements:
  // Three fictional client orgs submit observations on inconsistent treatment of seasonal SME cash flow.
  observations: [
    {
      id: "obs_apex_seasonality_01",
      title: "Seasonal Q4 inventory surge misclassified as structural leverage spike in SME retail borrowers",
      description: "Our commercial underwriting models penalized 18 retail SME borrowers for high leverage during Q3-Q4 inventory accumulation, ignoring that seasonal Q1 receivables consistently clear these obligations within 75 days.",
      privateDetails: "Client internal customer IDs [CUST-9921, CUST-8832] in Manchester & Birmingham branches. Internal risk committee flagged risk buffer adjustment.",
      offering: "Financial Analysis Intelligence",
      industry: "Retail Wholesale",
      region: "EMEA",
      observationPeriod: "Q3 2025 - Q1 2026",
      confidence: "High",
      evidenceType: "Portfolio Anomaly Distribution",
      sharingScope: "proposed_sharing", // private_to_author | organisation_only | proposed_sharing
      status: "approved_published", // draft | pending_review | in_review | needs_clarification | approved_published | rejected | withdrawn | reported
      authorId: "usr_client_apex_david",
      authorName: "David Chen",
      authorOrgId: "tenant_apex_bank",
      authorOrgName: "Apex Global Bank",
      
      // Explicit separate consent records (Hackathon Page 10)
      consents: {
        storeAndProcess: true,
        publishReviewedShared: true,
        discloseAttribution: false, // De-identified by default
        futureTrainingOptIn: true
      },

      // Reviewed & De-identified public representation (Hackathon Page 9 & 10)
      reviewedRepresentation: {
        title: "Seasonal Q4 inventory buildup treated as persistent debt spike in wholesale retail SMEs",
        summary: "Empirical observation of wholesale retail SMEs shows cyclical 40-60% credit line utilization spikes in Q3-Q4 due to stock build, routinely normalizing in early Q1 upon receivables realization. Standard static leverage thresholds produce false-positive risk warnings.",
        offering: "Financial Analysis Intelligence",
        industry: "Retail Wholesale",
        region: "EMEA",
        observationPeriod: "H2 2025 - H1 2026",
        evidenceGrade: "A - Committee Verified",
        moderatorNotes: "Approved. All specific customer IDs and regional branch identifiers removed. Anonymized to industry cohort.",
        approvedAt: "2026-10-15T14:30:00Z",
        approvedBy: "usr_emp_aisha"
      },

      version: 1,
      createdAt: "2026-10-12T10:15:00Z",
      updatedAt: "2026-10-15T14:30:00Z",
      qualityVotes: { useful: 24, needsEvidence: 1 }
    },

    {
      id: "obs_meridian_seasonality_02",
      title: "Agri-business pre-harvest working capital cycles trigger erroneous credit default warnings",
      description: "Farms and agribusiness suppliers in the Nile and Jordan Valley borrow heavily during pre-harvest seeding and machinery overhaul. Standard cash-flow algorithms treat the dry interim as structural insolvency rather than natural cyclicality.",
      privateDetails: "Client internal loan accounts AGRI-8820 through AGRI-8950. Credit loss provision was falsely elevated by 1.2M AED.",
      offering: "Financial Analysis Intelligence",
      industry: "Agri-Business & Trade",
      region: "Middle East",
      observationPeriod: "Q1 2025 - Q3 2025",
      confidence: "High",
      evidenceType: "Empirical Default Anomaly",
      sharingScope: "proposed_sharing",
      status: "approved_published",
      authorId: "usr_client_meridian_tariq",
      authorName: "Tariq Al-Sayed",
      authorOrgId: "tenant_meridian_trust",
      authorOrgName: "Meridian Trust",

      consents: {
        storeAndProcess: true,
        publishReviewedShared: true,
        discloseAttribution: false,
        futureTrainingOptIn: true
      },

      reviewedRepresentation: {
        title: "Agri-business harvest cycles trigger false-positive liquidity crunch indicators",
        summary: "Pre-harvest operational financing generates acute interim cash deficit metrics that do not correlate with default probability once seasonal harvest yields are factored into a multi-year cyclical cash-flow baseline.",
        offering: "Financial Analysis Intelligence",
        industry: "Agri-Business & Trade",
        region: "Middle East",
        observationPeriod: "FY 2025",
        evidenceGrade: "A - Empirically Corroborated",
        moderatorNotes: "Redacted currency figures and proprietary client portfolio identifiers. Verified synthetic consistency.",
        approvedAt: "2026-10-18T11:00:00Z",
        approvedBy: "usr_emp_aisha"
      },

      version: 1,
      createdAt: "2026-10-16T09:20:00Z",
      updatedAt: "2026-10-18T11:00:00Z",
      qualityVotes: { useful: 19, needsEvidence: 2 }
    },

    {
      id: "obs_gulf_seasonality_03",
      title: "Hospitality & Tourism off-season liquidity dips misjudged by static debt-service models",
      description: "Hotel operators and destination logistics operators in coastal GCC experience 65% revenue declines during summer months, offset by high winter liquidity. The underwriting engine flagged 32 facilities for debt restructuring prematurely.",
      privateDetails: "Contractual pricing schedules and private facility numbers for Red Sea coastal operators.",
      offering: "Financial Analysis Intelligence",
      industry: "Hospitality & Tourism",
      region: "GCC",
      observationPeriod: "Q2 2025 - Q4 2025",
      confidence: "High",
      evidenceType: "Historical Loan Performance",
      sharingScope: "proposed_sharing",
      status: "approved_published",
      authorId: "usr_client_gulf_fatima",
      authorName: "Fatima Zahra",
      authorOrgId: "tenant_gulf_financial",
      authorOrgName: "Gulf Financial Corp",

      consents: {
        storeAndProcess: true,
        publishReviewedShared: true,
        discloseAttribution: false,
        futureTrainingOptIn: true
      },

      reviewedRepresentation: {
        title: "Tourism & leisure sector off-season cash drawdown incorrectly triggers facility distress alerts",
        summary: "Extreme seasonal tourism revenue swings are being treated as deteriorating credit fundamentals rather than predictable seasonality, necessitating a 24-month cyclical smoothing algorithm.",
        offering: "Financial Analysis Intelligence",
        industry: "Hospitality & Tourism",
        region: "GCC",
        observationPeriod: "Q2-Q4 2025",
        evidenceGrade: "A - Cross-Corroborated",
        moderatorNotes: "Approved de-identified representation. Retains core risk insight without exposing customer names or pricing.",
        approvedAt: "2026-10-20T16:15:00Z",
        approvedBy: "usr_emp_aisha"
      },

      version: 1,
      createdAt: "2026-10-19T13:40:00Z",
      updatedAt: "2026-10-20T16:15:00Z",
      qualityVotes: { useful: 28, needsEvidence: 0 }
    },

    // A pending observation awaiting review
    {
      id: "obs_apex_pending_04",
      title: "Cross-Border FX volatility during trade tariff adjustments in East Africa corridor",
      description: "Observed sudden 14-day FX spread widenings distorting trade invoice reconciliation in our Nairobi-Dubai SME supply chain facilities.",
      privateDetails: "Internal treasury hedging spread limits and specific partner bank routing codes.",
      offering: "SME Credit Decisioning",
      industry: "Logistics & Trade",
      region: "East Africa & Middle East",
      observationPeriod: "September 2026",
      confidence: "Medium",
      evidenceType: "Transaction Log Telemetry",
      sharingScope: "proposed_sharing",
      status: "pending_review",
      authorId: "usr_client_apex_david",
      authorName: "David Chen",
      authorOrgId: "tenant_apex_bank",
      authorOrgName: "Apex Global Bank",
      consents: {
        storeAndProcess: true,
        publishReviewedShared: true,
        discloseAttribution: false,
        futureTrainingOptIn: true
      },
      reviewedRepresentation: null,
      version: 1,
      createdAt: "2026-10-28T10:00:00Z",
      updatedAt: "2026-10-28T10:00:00Z",
      qualityVotes: { useful: 0, needsEvidence: 0 }
    },

    // A private draft belonging to Apex Bank
    {
      id: "obs_apex_draft_05",
      title: "[Draft] Internal note on automated collateral valuation drift for industrial machinery",
      description: "Private scratchpad notes comparing secondary market machinery auction recovery rates against depreciation schedules.",
      privateDetails: "Confidential appraisal records.",
      offering: "SME Credit Decisioning",
      industry: "Manufacturing",
      region: "EMEA",
      observationPeriod: "Current",
      confidence: "Preliminary",
      evidenceType: "Internal Valuation Study",
      sharingScope: "private_to_author",
      status: "draft",
      authorId: "usr_client_apex_david",
      authorName: "David Chen",
      authorOrgId: "tenant_apex_bank",
      authorOrgName: "Apex Global Bank",
      consents: {
        storeAndProcess: true,
        publishReviewedShared: false,
        discloseAttribution: false,
        futureTrainingOptIn: false
      },
      reviewedRepresentation: null,
      version: 1,
      createdAt: "2026-10-29T08:30:00Z",
      updatedAt: "2026-10-29T08:30:00Z",
      qualityVotes: { useful: 0, needsEvidence: 0 }
    }
  ],

  // Aggregated Collective Themes (Hackathon Page 10 & 11)
  // Demonstrating minimum 3 distinct contributing organisations safeguard!
  themes: [
    {
      id: "theme_seasonality_01",
      title: "Seasonality Context in SME Cash Flow & Working Capital Evaluation",
      offering: "Financial Analysis Intelligence",
      category: "Underwriting Precision",
      summary: "Recurring evidence across 3 distinct financial institutions demonstrates that static quarterly leverage calculations consistently misclassify predictable seasonal inventory accumulation and harvest cycles as credit distress.",
      observationPeriod: "FY 2025 - H1 2026",
      distinctContributingOrgs: 3, // Meets threshold of >= 3!
      contributingOrgNamesDeIdentified: ["Tier-1 Commercial Bank", "Regional Corporate Trust", "Specialized Trade Lending Corp"],
      linkedObservationIds: [
        "obs_apex_seasonality_01",
        "obs_meridian_seasonality_02",
        "obs_gulf_seasonality_03"
      ],
      confidence: "High (Multi-institution corroboration)",
      limitations: "Observations concentrated in retail wholesale, agribusiness, and hospitality. Further data required for construction contractors.",
      privacySafeguardStatus: "compliant", // compliant (>=3 orgs) | suppressed (<3 orgs)
      suppressionWarning: null,
      latestUpdate: "2026-10-21T09:00:00Z",
      linkedIdeaId: "idea_seasonality_01"
    },
    {
      id: "theme_fx_latency_02",
      title: "Cross-Border Settlement Latency in Emerging Trade Corridors",
      offering: "SME Credit Decisioning",
      category: "Operational Friction",
      summary: "SME trade finance pipelines experience working capital gaps due to localized central bank clearing windows in cross-border corridors.",
      observationPeriod: "Q3 2026",
      distinctContributingOrgs: 2, // Less than 3! Small cohort protection active!
      contributingOrgNamesDeIdentified: ["International Tier-1 Bank", "Trade Lending Corp"],
      linkedObservationIds: ["obs_apex_pending_04"],
      confidence: "Preliminary / Low Sample",
      limitations: "Cohort size is below the 3-organisation threshold. Detailed breakdowns and geographic cross-tabs are suppressed.",
      privacySafeguardStatus: "suppressed", // Demonstrates requirement on Page 10!
      suppressionWarning: "Small Cohort Protection Active: Distinct contributing organisations < 3. Sensitive breakdowns, regional filters, and author details suppressed to prevent re-identification.",
      latestUpdate: "2026-10-28T10:00:00Z",
      linkedIdeaId: null
    }
  ],

  // Product Owner Improvement Ideas (Hackathon Page 11)
  improvementIdeas: [
    {
      id: "idea_seasonality_01",
      title: "Financial Analysis Intelligence: Add Seasonality-Aware Working Capital Comparison Model",
      problemStatement: "Standard debt-service coverage ratio (DSCR) and cash-flow velocity algorithms in Financial Analysis Intelligence treat seasonal working capital spikes as structural leverage increases, generating elevated false-positive credit downgrades for retail, agricultural, and tourism SMEs.",
      offering: "Financial Analysis Intelligence",
      supportingContributionReferences: [
        "obs_apex_seasonality_01 (EMEA Retail Wholesale)",
        "obs_meridian_seasonality_02 (Middle East Agri-business)",
        "obs_gulf_seasonality_03 (GCC Hospitality & Leisure)"
      ],
      proposedOutcome: "Introduce a multi-year cyclical cash-flow decomposition layer. The model will calculate 24-36 month seasonal indices per industry classification (NAICS/SIC) and evaluate debt-servicing capacity relative to historical seasonal cycles rather than linear trailing-twelve-month averages.",
      ownerTeam: "Priya Sharma / Credit Intelligence Core Squad",
      priority: "High",
      status: "Under review", // Proposed | Under review | Planned | In progress | Released | Not proceeding
      lastUpdate: "2026-10-22T14:00:00Z",
      publicClientSafeUpdate: "The Credit Intelligence squad has completed preliminary synthetic stress testing of a 24-month seasonality decomposition model. Initial benchmarking demonstrates a 42% reduction in false-positive liquidity alerts while maintaining default capture accuracy. Architectural review scheduled for Q4.",
      internalRoadmapNotes: "INTERNAL ONLY: Target deployment with Release 2027.1. Synthetic validation in progress with synthetic client holdout data. No customer-specific data used.",
      auditLog: [
        {
          timestamp: "2026-10-20T17:00:00Z",
          action: "IDEA_CREATED",
          performedBy: "usr_emp_priya (Priya Sharma)",
          details: "Idea initiated based on aggregated collective learning theme 'Seasonality Context in SME Cash Flow'."
        },
        {
          timestamp: "2026-10-22T14:00:00Z",
          action: "STATUS_CHANGE",
          performedBy: "usr_emp_priya (Priya Sharma)",
          details: "Status advanced from 'Proposed' to 'Under review' following verification of 3 distinct participating organisations."
        }
      ]
    }
  ],

  // Internal Experiments & Knowledge Library (Hackathon Page 6)
  internalExperiments: [
    {
      id: "exp_01",
      title: "Transformer-based Sparse Attention for 10-K Balance Sheet Ingestion",
      lead: "Dr. Marcus Vance",
      squad: "AI Research & Core NLP",
      status: "Active Prototype",
      lastUpdated: "2026-10-25",
      audience: "internal_employee_only",
      summary: "Evaluates multi-head sparse attention over dense tabular financial statements to cut hallucination rate in credit memo summarization by 68%."
    },
    {
      id: "exp_02",
      title: "Differential Privacy Noise Calibration for Cross-Border Risk Benchmarks",
      lead: "Aisha Al-Mansoor",
      squad: "AI Governance & Trust",
      status: "In Peer Review",
      lastUpdated: "2026-10-27",
      audience: "internal_employee_only",
      summary: "Testing Renyi Differential Privacy budget allocations (epsilon 1.25, delta 1e-5) to guarantee individual facility confidentiality in shared cohort analytics."
    }
  ],

  // Live Broadcasts & Webinars (Hackathon Page 4, 6, 7)
  liveBroadcasts: [
    {
      id: "live_01",
      title: "Building Governed Collective Intelligence in Tier-1 Banking",
      type: "Public Executive Webinar",
      audience: "public",
      status: "recorded",
      speaker: "Srinivas Rao (Chief AI Strategist, Azentio)",
      duration: "48 mins",
      views: 1240,
      description: "How leading commercial institutions convert isolated market feedback into de-identified, privacy-preserving collective learning without risking regulatory or proprietary breach.",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    },
    {
      id: "live_02",
      title: "Azentio SME Decisioning 2026 Fall Release & Roadmap Preview",
      type: "Client Exclusive Briefing",
      audience: "client_only",
      status: "recorded",
      speaker: "Priya Sharma (Senior Product Specialist)",
      duration: "35 mins",
      views: 310,
      description: "Deep dive into new credit scoring calibrations, dynamic scenario simulations, and client feedback integration for entitled partners.",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    },
    {
      id: "live_03",
      title: "Internal Engineering Townhall: AIRA v3 Multi-Agent Synthesis Architecture",
      type: "Internal Employee Broadcast",
      audience: "internal_employee_only",
      status: "upcoming",
      speaker: "Marcus Vance (AI Lead) & Kiran Rao (Infrastructure)",
      duration: "60 mins",
      views: 0,
      description: "Confidential roadmap for scaling federated model coordination across Kubernetes clusters and securing agent prompt boundaries.",
      scheduledFor: "2026-11-05T14:00:00Z"
    }
  ],

  // Advanced Track 11: Federated Model Learning Track State (Hackathon Page 12)
  federatedTrack: {
    programmeName: "Azentio Governed SME Credit Risk Federated Consortium",
    description: "An explicitly separate, opt-in federated learning programme. Participating client banks keep their training records strictly within their own local boundaries and compute governed model updates. The central Azentio Coordinator aggregates weight updates (FedAvg) without ever accessing raw client records.",
    learningTask: "Binary Classification: Predict 90-day SME credit delinquency given seasonal cash flow volatility, debt-to-revenue ratio, supplier concentration, and days sales outstanding (DSO).",
    modelArchitecture: "Governed Logistic / Multi-Layer Perceptron (Input Features: 8, Hidden: 16, Output: 1)",
    featureSchema: [
      { name: "seasonal_cashflow_volatility", type: "float", description: "Standard deviation of monthly cash flows relative to annual mean" },
      { name: "cyclical_debt_service_ratio", type: "float", description: "Debt service payment divided by seasonally adjusted operating income" },
      { name: "supplier_concentration_index", type: "float", description: "Herfindahl-Hirschman Index of top 3 inventory suppliers" },
      { name: "days_sales_outstanding", type: "int", description: "Average collection period for trade receivables" },
      { name: "operating_margin_stability", type: "float", description: "Cyclical stability index of EBIT margin over 24 months" },
      { name: "working_capital_turnover", type: "float", description: "Annualized inventory turns relative to industry peer median" },
      { name: "prior_restructure_flag", type: "int", description: "Binary indicator (0 or 1) of prior debt modification" },
      { name: "macro_sector_sensitivity", type: "float", description: "Elasticity to interest rate shifts" }
    ],
    threatModel: {
      dataLeakageRisk: "Model gradients / weights can potentially leak training record features if unbounded.",
      defenseClipping: "Gradient / weight clipping norm C = 1.5 enforced per participant update.",
      defenseDifferentialPrivacy: "Calibrated Gaussian noise N(0, sigma^2) added to aggregated weights (epsilon = 1.25, delta = 1e-5).",
      poisoningDefense: "Cosine-similarity anomaly filtering rejects weight updates with outlier trajectory (>2.5 std from median update).",
      localDataRetention: "100% of raw credit records remain inside local synthetic client environments. Coordinator logs reject raw data."
    },
    participants: [
      {
        orgId: "tenant_apex_bank",
        orgName: "Apex Global Bank",
        datasetName: "Synthetic Retail SME Portfolio (UK & EU)",
        recordCount: 4200,
        status: "authenticated_active",
        optInConsentDate: "2026-02-01",
        weightContributionShare: 0.42
      },
      {
        orgId: "tenant_meridian_trust",
        orgName: "Meridian Trust",
        datasetName: "Synthetic Agri & Trade SME Portfolio (Middle East)",
        recordCount: 3100,
        status: "authenticated_active",
        optInConsentDate: "2026-02-15",
        weightContributionShare: 0.31
      },
      {
        orgId: "tenant_gulf_financial",
        orgName: "Gulf Financial Corp",
        datasetName: "Synthetic Tourism & Commercial Portfolio (GCC)",
        recordCount: 2700,
        status: "authenticated_active",
        optInConsentDate: "2026-03-05",
        weightContributionShare: 0.27
      }
    ],
    rounds: [
      {
        roundNumber: 1,
        timestamp: "2026-10-10T11:00:00Z",
        participatingOrgs: ["tenant_apex_bank", "tenant_meridian_trust", "tenant_gulf_financial"],
        aggregationMethod: "FedAvg with L2 Clipping (C=1.5)",
        dpBudgetSpent: { epsilon: 0.45, delta: "1e-5" },
        holdoutMetrics: {
          accuracy: 0.832,
          f1Score: 0.814,
          aucRoc: 0.865,
          loss: 0.392
        },
        baselineComparison: {
          baselineAccuracy: 0.765,
          improvement: "+6.7%"
        },
        status: "completed"
      },
      {
        roundNumber: 2,
        timestamp: "2026-10-24T15:30:00Z",
        participatingOrgs: ["tenant_apex_bank", "tenant_meridian_trust", "tenant_gulf_financial"],
        aggregationMethod: "FedAvg with Adaptive DP Noise (sigma=0.85)",
        dpBudgetSpent: { epsilon: 0.88, delta: "1e-5" },
        holdoutMetrics: {
          accuracy: 0.894,
          f1Score: 0.879,
          aucRoc: 0.921,
          loss: 0.285
        },
        baselineComparison: {
          baselineAccuracy: 0.765,
          improvement: "+12.9%"
        },
        status: "completed"
      }
    ],
    candidateModels: [
      {
        version: "v1.2-candidate",
        createdAt: "2026-10-25T09:00:00Z",
        trainedRounds: 2,
        holdoutAccuracy: "89.4%",
        holdoutF1: "0.879",
        status: "pending_human_review", // pending_human_review | approved_active | rolled_back | rejected
        humanReviewer: null,
        reviewNotes: "Awaiting CRO approval and fairness parity check across skewed regional sectors.",
        rollbackTarget: "v1.0-baseline"
      },
      {
        version: "v1.0-baseline",
        createdAt: "2026-09-01T00:00:00Z",
        trainedRounds: 0,
        holdoutAccuracy: "76.5%",
        holdoutF1: "0.742",
        status: "approved_active",
        humanReviewer: "usr_admin_kiran",
        reviewNotes: "Default baseline credit risk scoring parameters.",
        rollbackTarget: null
      }
    ],
    withdrawalPolicy: {
      statement: "A client organization may withdraw consent at any time. Withdrawal immediately revokes eligibility for subsequent training rounds and excludes client-held weights from coordinator memory. However, mathematically, already aggregated and deployed historic model candidate checkpoints cannot be automatically 'untrained'. In the event of confirmed data corruption or consent breach, the coordinator enforces human rollback to an earlier audited model candidate version.",
      sla: "Withdrawal takes effect within 60 seconds across all coordinator active queues."
    }
  },

  // System Audit Logs (IAM-01 privileged action audits, moderation, and idea changes)
  auditLogs: [
    {
      id: "aud_01",
      timestamp: "2026-10-15T14:30:00Z",
      userId: "usr_emp_aisha",
      userName: "Aisha Al-Mansoor",
      role: "learning_moderator",
      action: "MODERATION_APPROVE_AND_PUBLISH",
      targetResourceId: "obs_apex_seasonality_01",
      targetType: "observation",
      details: "Approved de-identified representation for public collective learning. Customer and branch IDs redacted."
    },
    {
      id: "aud_02",
      timestamp: "2026-10-20T17:00:00Z",
      userId: "usr_emp_priya",
      userName: "Priya Sharma",
      role: "product_owner",
      action: "IMPROVEMENT_IDEA_CREATED",
      targetResourceId: "idea_seasonality_01",
      targetType: "improvement_idea",
      details: "Created improvement idea linked to 3 verified client observations on SME seasonality."
    },
    {
      id: "aud_03",
      timestamp: "2026-10-25T11:00:00Z",
      userId: "usr_admin_kiran",
      userName: "Kiran Rao",
      role: "portal_admin",
      action: "FEDERATED_COORDINATOR_ROUND_DISPATCH",
      targetResourceId: "round_2",
      targetType: "federated_round",
      details: "Executed Round 2 FedAvg aggregation with differential privacy budget check."
    }
  ],

  // In-App Notifications
  notifications: [
    {
      id: "notif_01",
      userId: "usr_client_apex_david",
      title: "Observation Approved & Shared",
      message: "Your observation 'Seasonal Q4 inventory surge' has been reviewed, safely de-identified, and published to the collective learning feed.",
      timestamp: "2026-10-15T14:35:00Z",
      read: false,
      type: "success"
    },
    {
      id: "notif_02",
      userId: "usr_client_apex_david",
      title: "Improvement Idea Linked to Your Feedback",
      message: "Product Owner Priya Sharma has linked your observation to an active Improvement Idea: 'Seasonality-Aware Working Capital Comparison Model'.",
      timestamp: "2026-10-20T17:05:00Z",
      read: false,
      type: "info"
    },
    {
      id: "notif_03",
      userId: "usr_emp_priya",
      title: "New Collective Learning Theme Available",
      message: "Theme 'Seasonality Context in SME Cash Flow' has met the 3-organisation threshold and is ready for product review.",
      timestamp: "2026-10-20T16:20:00Z",
      read: true,
      type: "alert"
    }
  ],

  // Client Invitations (Hackathon Page 5)
  invitations: [
    {
      id: "inv_apex_9821",
      token: "tok_invite_apex_sample",
      tenantId: "tenant_apex_bank",
      tenantName: "Apex Global Bank",
      email: "elena.rostova@apexbank.com",
      proposedRole: "client_member",
      invitedBy: "usr_client_apex_sarah",
      status: "pending",
      expiresAt: "2026-11-15T00:00:00Z",
      createdAt: "2026-10-30T10:00:00Z"
    }
  ]
};

// In-memory cache + persistent disk store helper
let currentStore = null;

export function getStore() {
  if (currentStore) return currentStore;
  
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      currentStore = JSON.parse(content);
      return currentStore;
    }
  } catch (err) {
    console.error("Error reading store from disk, falling back to seed:", err);
  }

  // Initialize and persist seed
  currentStore = JSON.parse(JSON.stringify(INITIAL_DATA));
  saveStore(currentStore);
  return currentStore;
}

export function saveStore(store) {
  try {
    currentStore = store;
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Failed to persist azentio store:", err);
    return false;
  }
}
