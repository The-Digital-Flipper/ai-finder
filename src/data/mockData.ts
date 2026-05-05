// ── Mock data for Browser Clarity dashboard ──────────────────────────────────

export interface KpiData {
  id: string
  label: string
  value: string
  rawValue: number
  delta: string
  deltaPositive: boolean
  severity: 'critical' | 'high' | 'medium' | 'low' | 'good'
  sparkline: { v: number }[]
  unit?: string
}

export const kpiData: KpiData[] = [
  {
    id: 'risk',
    label: 'Risk Score',
    value: '84',
    rawValue: 84,
    delta: '−6% vs last week',
    deltaPositive: false,
    severity: 'critical',
    sparkline: [{ v: 90 }, { v: 88 }, { v: 91 }, { v: 87 }, { v: 86 }, { v: 85 }, { v: 84 }],
  },
  {
    id: 'events',
    label: 'Critical Events Today',
    value: '12',
    rawValue: 12,
    delta: '+3 vs yesterday',
    deltaPositive: true,
    severity: 'high',
    sparkline: [{ v: 5 }, { v: 8 }, { v: 6 }, { v: 11 }, { v: 9 }, { v: 10 }, { v: 12 }],
  },
  {
    id: 'trackers',
    label: 'Tracking Attempts Prevented',
    value: '1,284',
    rawValue: 1284,
    delta: '+18% vs last week',
    deltaPositive: true,
    severity: 'good',
    sparkline: [{ v: 900 }, { v: 950 }, { v: 1020 }, { v: 1100 }, { v: 1180 }, { v: 1240 }, { v: 1284 }],
  },
  {
    id: 'leaks',
    label: 'Data Leak Attempts Prevented',
    value: '47',
    rawValue: 47,
    delta: '+12% vs last week',
    deltaPositive: true,
    severity: 'good',
    sparkline: [{ v: 30 }, { v: 33 }, { v: 36 }, { v: 39 }, { v: 42 }, { v: 45 }, { v: 47 }],
  },
  {
    id: 'exposure',
    label: 'Estimated Exposure Reduction',
    value: '73%',
    rawValue: 73,
    delta: '+5% vs last week',
    deltaPositive: true,
    severity: 'good',
    sparkline: [{ v: 60 }, { v: 62 }, { v: 65 }, { v: 68 }, { v: 70 }, { v: 72 }, { v: 73 }],
  },
]

// ── Event Feed ────────────────────────────────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export interface EventBundle {
  id: string
  title: string
  count: number
  severity: Severity
  lastSeen: string
  aiSummary: string
  events: { time: string; detail: string }[]
}

export const eventBundles: EventBundle[] = [
  {
    id: 'eb1',
    title: 'Session hijacking attempts blocked',
    count: 4,
    severity: 'critical',
    lastSeen: '2 min ago',
    aiSummary:
      'Four separate attempts to steal authenticated session tokens were detected and blocked. If successful, attackers could have impersonated your users across payment and admin areas.',
    events: [
      { time: '06:38', detail: 'Cookie theft via iframe — payments.acme.com' },
      { time: '06:35', detail: 'XSS session probe — admin.acme.com' },
      { time: '06:28', detail: 'Credential replay attempt — auth.acme.com' },
      { time: '06:14', detail: 'Token exfiltration to cdn-track.io — app.acme.com' },
    ],
  },
  {
    id: 'eb2',
    title: 'Sensitive data transmitted to third parties',
    count: 7,
    severity: 'critical',
    lastSeen: '8 min ago',
    aiSummary:
      'Seven network requests containing PII (email addresses, user IDs) were intercepted before reaching unauthorized third-party domains. Potential GDPR/CCPA exposure was avoided.',
    events: [
      { time: '06:32', detail: 'Email hash sent to pixel.tracker.io' },
      { time: '06:31', detail: 'User ID in query string — ad.doubleclick.net' },
      { time: '06:30', detail: 'Phone number in form data — analytics.io' },
      { time: '06:25', detail: 'Full name in referrer header — cdn-ads.com' },
      { time: '06:20', detail: 'Email + device fingerprint — track.fb.com' },
      { time: '06:18', detail: 'User ID beacon — segment.io (unapproved)' },
      { time: '06:10', detail: 'Postal code in analytics payload — ga4.google' },
    ],
  },
  {
    id: 'eb3',
    title: 'Unauthorized script execution blocked',
    count: 3,
    severity: 'high',
    lastSeen: '15 min ago',
    aiSummary:
      'Three inline scripts injected via compromised ad networks were prevented from executing. These scripts attempted to fingerprint browser capabilities for cross-site tracking.',
    events: [
      { time: '06:25', detail: 'Fingerprint script — ad-network.co' },
      { time: '06:22', detail: 'Cryptominer injection attempt — cdn3.io' },
      { time: '06:18', detail: 'Form keylogger injected via iframe' },
    ],
  },
  {
    id: 'eb4',
    title: 'High-risk permission requests denied',
    count: 5,
    severity: 'high',
    lastSeen: '22 min ago',
    aiSummary:
      'Five third-party vendors attempted to request sensitive browser permissions (microphone, clipboard, geolocation) without user consent. All were blocked before the prompt appeared.',
    events: [
      { time: '06:15', detail: 'Clipboard read — widget.zendesk.com' },
      { time: '06:14', detail: 'Geolocation — maps-embed.io' },
      { time: '06:12', detail: 'Microphone access — voice-analytics.io' },
      { time: '06:10', detail: 'Screen capture attempt — rec.fullstory.com' },
      { time: '06:08', detail: 'Notification spam — push.onesignal.com' },
    ],
  },
  {
    id: 'eb5',
    title: 'Third-party cookies blocked',
    count: 24,
    severity: 'medium',
    lastSeen: '30 min ago',
    aiSummary:
      '24 cross-site tracking cookies from 11 ad-tech vendors were blocked. These would have built persistent behavioral profiles of your users across unrelated websites.',
    events: [
      { time: '06:00', detail: 'IDFA sync cookie — tapad.com' },
      { time: '05:58', detail: 'Retargeting pixel — criteo.com' },
      { time: '05:55', detail: 'Cross-site ID cookie — adsrvr.org (×6)' },
      { time: '05:50', detail: 'Audience segment cookie — casalemedia.com (×4)' },
      { time: '05:45', detail: 'LiveRamp identity cookie — rlcdn.com (×9)' },
    ],
  },
  {
    id: 'eb6',
    title: 'Analytics beacons throttled',
    count: 58,
    severity: 'low',
    lastSeen: '45 min ago',
    aiSummary:
      'Non-essential analytics beacons were throttled to reduce page load impact. No sensitive data was involved.',
    events: [
      { time: '05:30', detail: 'Page-view beacon — ga4.google.com (×22)' },
      { time: '05:28', detail: 'Heatmap event — hotjar.com (×18)' },
      { time: '05:20', detail: 'Error beacon — sentry.io (×18)' },
    ],
  },
]

// ── Proof of Value ────────────────────────────────────────────────────────────

export const proofOfValue = {
  leaksPrevented: 47,
  trackersBlocked: 1284,
  sensitiveCookiesProtected: 312,
  blockedVendors: [
    { category: 'Ad Networks', count: 34 },
    { category: 'Data Brokers', count: 18 },
    { category: 'Social Trackers', count: 12 },
    { category: 'Analytics', count: 9 },
    { category: 'Session Recorders', count: 7 },
  ],
}

// ── Executive view outcome cards ──────────────────────────────────────────────

export const executiveCards = [
  {
    id: 'risk-summary',
    title: 'Overall Risk Level',
    value: 'HIGH',
    detail: 'Risk score 84/100 — 3 critical issues require attention today.',
    color: 'text-red-400',
    bg: 'bg-red-950/40',
    border: 'border-red-800/50',
  },
  {
    id: 'top-threats',
    title: 'Top Business Threat',
    value: 'Session Theft',
    detail: '4 hijacking attempts blocked in the last hour. Payment & admin portals targeted.',
    color: 'text-orange-400',
    bg: 'bg-orange-950/40',
    border: 'border-orange-800/50',
  },
  {
    id: 'leaks',
    title: 'Data Leaks Prevented',
    value: '47 today',
    detail: 'PII (email, phone, user IDs) stopped from reaching 14 unauthorized vendors.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/40',
    border: 'border-indigo-800/50',
  },
  {
    id: 'roi',
    title: 'Estimated ROI',
    value: '$42,000',
    detail: 'Estimated cost of a breach avoided this month based on industry averages.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800/50',
  },
  {
    id: 'actions',
    title: 'Recommended Actions',
    value: '3 items',
    detail: 'Review session token policy · Audit third-party scripts · Export compliance report.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-800/50',
  },
]
