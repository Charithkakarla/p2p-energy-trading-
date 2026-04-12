import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, ScrollView, TouchableOpacity,
  useWindowDimensions, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import {
  Zap, Menu, X,
  UserCheck, ListPlus, CheckCircle2, BadgeDollarSign,
  Search, FilePen, ReceiptText,
  ArrowRight, Leaf, ShieldCheck, ChevronRight, Play,
  TrendingUp, Sun, Battery, Mail, Phone, Smartphone,
  Linkedin, Twitter, Instagram, Facebook, MessageCircle
} from 'lucide-react-native';
import { ThemedText } from '../components/ThemedText';
import { AuthModal } from '../components/AuthModal';

// ─── Theme — Modern Minimal SaaS + Sustainability ─────────────────────────────
const T = {
  bg:         '#f9fafb',   // page background
  white:      '#ffffff',
  textH:      '#0f172a',   // headings — near black
  textB:      '#374151',   // body
  textMuted:  '#6b7280',   // muted
  green:      '#22c55e',
  greenDark:  '#16a34a',
  greenLight: '#dcfce7',
  greenBg:    '#f0fdf4',
  border:     '#e5e7eb',
  shadow:     '#00000014',
  navyFoot:   '#0f172a',
};

const NAV_LINKS = ['Home', 'How It Works', 'DISCOMs', 'Payment Flow', 'Blog', 'About'];
type Section = 'Home' | 'How It Works' | 'DISCOMs' | 'Payment Flow' | 'Blog' | 'About';

// ─── HOW IT WORKS data ────────────────────────────────────────────────────────
const HOW_STEPS = [
  { num: 1, color: '#22c55e', label: 'Register on Yagami', icon: <UserCheck size={28} color="#22c55e" />, stepLabel: 'STEP 1 OF 5', desc: 'Sign up on Yagami using your mobile number & OTP. No complex paperwork — your digital identity is established in minutes.', bullets: ['Mobile OTP-based signup', 'Choose your role: Consumer or Prosumer', 'Set up your trading preferences'] },
  { num: 2, color: '#3b82f6', label: 'Verify on DISCOM', icon: <ShieldCheck size={28} color="#3b82f6" />, stepLabel: 'STEP 2 OF 5', desc: 'Link your electricity provider (TSSPDCL, BRPL, etc.) to confirm your identity and meter connection.', bullets: ['Secure DISCOM API integration', 'Verifiable Credential issued by your DISCOM', 'One-time verification — no repeat paperwork'] },
  { num: 3, color: '#a855f7', label: 'Listing & Discovery', icon: <ListPlus size={28} color="#a855f7" />, stepLabel: 'STEP 3 OF 5', desc: 'Prosumers list surplus solar energy; buyers browse and filter offers by price, distance, and green rating.', bullets: ['Set your price per kWh or use dynamic market rates', 'Buyers search, filter, and shortlist offers', 'Real-time availability from smart meters'] },
  { num: 4, color: '#eab308', label: 'Start Trading', icon: <CheckCircle2 size={28} color="#eab308" />, stepLabel: 'STEP 4 OF 5', desc: 'Buyers place offers; sellers accept manually or via auto-accept. All trades are blockchain-logged.', bullets: ['Instant trade matching engine', 'Auto-accept or manual approval', 'Immutable blockchain trade receipt'] },
  { num: 5, color: '#f97316', label: 'Payment & Settlement', icon: <BadgeDollarSign size={28} color="#f97316" />, stepLabel: 'STEP 5 OF 5', desc: 'Payments are settled T+2 to the seller wallet. Energy units are recorded and adjusted in actual DISCOM electricity bills.', bullets: ['Automated payment transfer Buyer → Seller', 'Units adjusted in real DISCOM bills', 'Withdraw earnings anytime to your bank'] },
];

const TRADING_FLOW = [
  { num: 1, title: 'Onboarding', bullets: ['Prosumers & Consumers register with approved P2P platforms and local DISCOM', 'Participants receive a Verified Credential (VC) — digital identity confirming eligibility'] },
  { num: 2, title: 'Listing & Discovery', bullets: ['Prosumer lists surplus solar energy units on the digital platform via web/mobile app', 'Buyers search for offers or set preferences (cheapest, nearest, green energy)'] },
  { num: 3, title: 'Price Discovery', bullets: ['Buyers discover offers placed by sellers based on delivery time, price and quantity', 'The Seller receives the offer and can choose to accept or reject'] },
  { num: 4, title: 'Settlement', bullets: ['A Trade Order is created and shared to DISCOMs for settlement', 'DISCOMs verify actual energy delivered and consumed during the contract period'] },
  { num: 5, title: 'Payments', bullets: ['Trading platform facilitates transfer of payment from Buyer to Seller account', 'Units purchased and sold are recorded by DISCOM and adjusted in actual electricity bills'] },
];

const SELLER_STEPS = [
  { step: '01', icon: <UserCheck size={24} color={T.white} />, title: 'Register on Yagami', desc: 'Sign up with mobile OTP and declare your solar panel capacity & generation schedule.' },
  { step: '02', icon: <ShieldCheck size={24} color={T.white} />, title: 'Verify on DISCOM', desc: 'Link your electricity provider to verify your identity and rooftop meter.' },
  { step: '03', icon: <ListPlus size={24} color={T.white} />, title: 'List Your Energy', desc: 'Set price per kWh and units to sell. Choose fixed or dynamic pricing.' },
  { step: '04', icon: <CheckCircle2 size={24} color={T.white} />, title: 'Accept Trades', desc: 'Buyers bid on your catalogue. Approve or enable auto-accept with blockchain log.' },
  { step: '05', icon: <BadgeDollarSign size={24} color={T.white} />, title: 'Receive Payment', desc: 'T+2 settlement to your Yagami wallet. Withdraw to bank or offset your bill.' },
];

const BUYER_STEPS = [
  { step: '01', icon: <Search size={24} color={T.white} />, title: 'Register & Link DISCOM', desc: 'Sign up with OTP and link your DISCOM consumer ID to verify your connection.' },
  { step: '02', icon: <FilePen size={24} color={T.white} />, title: 'Browse Nearby Sellers', desc: 'View live listings of verified solar prosumers near you, sorted by price & distance.' },
  { step: '03', icon: <CheckCircle2 size={24} color={T.white} />, title: 'Place Your Offer', desc: 'Select units needed and confirm. Energy reserved instantly from your wallet.' },
  { step: '04', icon: <ReceiptText size={24} color={T.white} />, title: 'Settlement on Bill', desc: 'Purchased clean units are auto-deducted from your monthly DISCOM bill.' },
];

const DISCOM_DATA = [
  { region: 'SOUTH & WEST DELHI', color: '#22c55e', name: 'BRPL', fullName: 'BSES Rajdhani Power Limited', desc: 'If you are a Consumer or Prosumer in the BSES Rajdhani distribution area, use the link below to generate your verification from BRPL Portal.', areas: ['South Delhi', 'West Delhi', 'Dwarka', 'Janakpuri', 'Saket'], portal: 'BRPL Verification Portal' },
  { region: 'NORTH & NORTHWEST DELHI', color: '#3b82f6', name: 'Tata Power DDL', fullName: 'Tata Power Delhi Distribution Limited', desc: 'If you are a Consumer or Prosumer in the Tata Power DDL distribution area, use the link below to generate your verification from Tata Power DDL Portal.', areas: ['North Delhi', 'Rohini', 'Pitampura', 'Shalimar Bagh', 'Model Town'], portal: 'Tata Power DDL Verification Portal' },
  { region: 'WESTERN UTTAR PRADESH', color: '#a855f7', name: 'PVVNL', fullName: 'Paschimanchal Vidyut Vitran Nigam Limited', desc: 'If you are a Consumer or Prosumer in the PVVNL distribution area in Western UP, use the link below to generate your verification from PVVNL Portal.', areas: ['Meerut', 'Ghaziabad', 'Noida', 'Greater Noida', 'Hapur'], portal: 'PVVNL Verification Portal' },
];

const VERIFICATION_STEPS = [
  { num: 1, title: 'Onboarding', desc: 'Prosumers & Consumers register with approved P2P platforms and the local DISCOM.' },
  { num: 2, title: 'Verification', desc: 'Participants receive a Verifiable Credential (VC) — a digital identity confirming P2P eligibility.' },
  { num: 3, title: 'Listing & Discovery', desc: 'Prosumers list surplus solar energy. Buyers search for offers or set preferences.' },
  { num: 4, title: 'Price Discovery', desc: 'Buyers discover offers based on delivery time, price, and quantity. Sellers accept or reject.' },
];

const PAYMENT_BUYER_STEPS = [
  { num: 1, color: '#3b82f6', label: 'Recharge Wallet', icon: <FilePen size={26} color="#3b82f6" />, stepLabel: 'BUYER · STEP 1 OF 5', desc: 'Buyer recharges wallet to purchase Energy Credits. These credits are used to execute buy orders on the platform.', info: 'Add funds to your Yagami wallet using UPI, Net Banking, or Cards. Credits are held securely until a trade is settled.' },
  { num: 2, color: '#a855f7', label: 'Browse Options', icon: <Search size={26} color="#a855f7" />, stepLabel: 'BUYER · STEP 2 OF 5', desc: 'Browse verified solar sellers near you. Filter by price per kWh, distance, availability, and green rating.', info: 'Real-time listings updated from smart meters. Set alerts for your preferred price ranges.' },
  { num: 3, color: '#eab308', label: 'Select Trade', icon: <ListPlus size={26} color="#eab308" />, stepLabel: 'BUYER · STEP 3 OF 5', desc: 'Choose a seller, enter the number of units (kWh) you want to buy, and confirm your offer.', info: 'Energy units are reserved instantly from your wallet. The seller has 15 minutes to accept.' },
  { num: 4, color: '#22c55e', label: 'Receive Energy', icon: <Zap size={26} color="#22c55e" />, stepLabel: 'BUYER · STEP 4 OF 5', desc: 'Once the seller accepts, energy delivery is confirmed through the grid. Your DISCOM records the allocation.', info: 'Energy is delivered via your existing DISCOM grid — no new wiring or physical setup needed.' },
  { num: 5, color: '#f97316', label: 'Settlement', icon: <ReceiptText size={26} color="#f97316" />, stepLabel: 'BUYER · STEP 5 OF 5', desc: 'Purchased energy units are automatically credited in your monthly DISCOM electricity bill.', info: 'No extra payment required at billing. Units reduce your grid consumption bill automatically.' },
];

const PAYMENT_SELLER_STEPS = [
  { num: 1, color: '#22c55e', label: 'Register on Yagami', icon: <UserCheck size={26} color="#22c55e" />, stepLabel: 'SELLER · STEP 1 OF 5', desc: 'Sign up with mobile OTP and declare your solar panel capacity & typical generation schedule.', info: 'Quick OTP-based signup. Declare your solar capacity and set up your trading preferences in minutes.' },
  { num: 2, color: '#3b82f6', label: 'Verify on DISCOM', icon: <ShieldCheck size={26} color="#3b82f6" />, stepLabel: 'SELLER · STEP 2 OF 5', desc: 'Link your electricity provider to get a Verifiable Credential confirming your identity and meter.', info: 'One-time DISCOM verification via secure API. Your VC is blockchain-anchored and tamper-proof.' },
  { num: 3, color: '#a855f7', label: 'List Your Energy', icon: <ListPlus size={26} color="#a855f7" />, stepLabel: 'SELLER · STEP 3 OF 5', desc: 'Set your price per kWh, minimum order size, and available units from your solar generation.', info: 'Choose fixed pricing or let the market discover the best rate. Update listings anytime.' },
  { num: 4, color: '#eab308', label: 'Accept Trades', icon: <CheckCircle2 size={26} color="#eab308" />, stepLabel: 'SELLER · STEP 4 OF 5', desc: 'Buyers bid on your catalogue. Review and approve manually or enable smart auto-accept.', info: 'All accepted trades generate an immutable blockchain receipt visible to both parties.' },
  { num: 5, color: '#f97316', label: 'Receive Payment', icon: <BadgeDollarSign size={26} color="#f97316" />, stepLabel: 'SELLER · STEP 5 OF 5', desc: 'Earnings are settled T+2 to your Yagami wallet. Withdraw to your bank or use to offset your bill.', info: 'Secure, platform-facilitated transfer from buyer to seller. No cash handling or manual accounting.' },
];

// ─── Dashboard visual ─────────────────────────────────────────────────────────
function HeroDashboard() {
  return (
    <View style={s.dashWrap}>
      <View style={s.dashRow}>
        {[
          { icon: <Sun size={16} color="#eab308" />, label: 'Solar Generated', val: '24.8 kWh', bg: '#fefce8', border: '#fef08a' },
          { icon: <TrendingUp size={16} color="#22c55e" />, label: "Today's Earnings", val: '₹ 186', bg: '#f0fdf4', border: '#bbf7d0' },
        ].map(c => (
          <View key={c.label} style={[s.dashStatCard, { backgroundColor: c.bg, borderColor: c.border }]}>
            {c.icon}
            <ThemedText style={s.dashStatVal}>{c.val}</ThemedText>
            <ThemedText style={s.dashStatLabel}>{c.label}</ThemedText>
          </View>
        ))}
      </View>
      <View style={s.dashCard}>
        <View style={s.dashCardHeader}>
          <ThemedText style={s.dashCardTitle}>Live Trades</ThemedText>
          <View style={s.dashLiveDot} />
        </View>
        {[
          { from: 'Priya S.', units: '4 kWh', price: '₹31', active: true },
          { from: 'Rajan K.', units: '7 kWh', price: '₹52', active: false },
          { from: 'Arjun M.', units: '2 kWh', price: '₹15', active: true },
        ].map(t => (
          <View key={t.from} style={s.dashTradeRow}>
            <View style={s.dashAvatar}><ThemedText style={s.dashAvatarTxt}>{t.from[0]}</ThemedText></View>
            <View style={{ flex: 1 }}>
              <ThemedText style={s.dashTradeName}>{t.from}</ThemedText>
              <ThemedText style={s.dashTradeUnits}>{t.units}</ThemedText>
            </View>
            <ThemedText style={s.dashTradePrice}>{t.price}</ThemedText>
            <View style={[s.dashStatus, { backgroundColor: t.active ? '#dcfce7' : '#fef9c3' }]}>
              <ThemedText style={[s.dashStatusTxt, { color: t.active ? '#15803d' : '#92400e' }]}>{t.active ? 'Active' : 'Pending'}</ThemedText>
            </View>
          </View>
        ))}
      </View>
      <View style={s.dashCard}>
        <View style={s.dashCardHeader}>
          <Battery size={14} color={T.green} />
          <ThemedText style={s.dashCardTitle}>Grid Export</ThemedText>
          <ThemedText style={[s.dashCardTitle, { color: T.green, marginLeft: 'auto' as any }]}>12.3 kWh</ThemedText>
        </View>
        <View style={s.dashProgressBg}>
          <View style={[s.dashProgressFill, { width: '68%' }]} />
        </View>
        <ThemedText style={s.dashProgressLabel}>68% of daily quota sold</ThemedText>
      </View>
    </View>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
function MobileDrawer({ visible, onClose, activeSection, onNav, onAuth }: {
  visible: boolean; onClose: () => void;
  activeSection: Section; onNav: (s: Section) => void;
  onAuth: () => void;
}) {
  if (!visible) return null;
  return (
    <Pressable style={s.drawerOverlay} onPress={onClose}>
      <Pressable style={s.drawer} onPress={e => e.stopPropagation()}>
        <Pressable style={({hovered}: any) => [s.drawerClose, hovered && { backgroundColor: '#f1f5f9' }]} onPress={onClose}>
          <X size={20} color={T.textH} />
        </Pressable>
        <View style={s.logoRow}>
          <Zap size={18} color={T.green} fill={T.green} />
          <ThemedText style={[s.logoText, { color: T.textH }]}>Yagami</ThemedText>
        </View>
        <View style={s.drawerLinks}>
          {NAV_LINKS.map(link => (
            <Pressable
              key={link}
              style={({hovered}: any) => [s.drawerLink, activeSection === link && s.drawerLinkActive, hovered && activeSection !== link && { backgroundColor: '#f8fafc' }]}
              onPress={() => { onNav(link as Section); onClose(); }}
            >
              <ThemedText style={[s.drawerLinkText, activeSection === link && s.drawerLinkTextActive]}>
                {link}
              </ThemedText>
            </Pressable>
          ))}
        </View>
        <View style={s.drawerCtaGroup}>
          <Pressable style={({hovered}: any) => [s.drawerOutline, hovered && { backgroundColor: T.greenLight, transform: [{ scale: 1.02 }] }]} onPress={() => { onClose(); onAuth(); }}>
            <ThemedText style={s.drawerOutlineTxt}>Buy Energy</ThemedText>
          </Pressable>
          <Pressable style={({hovered}: any) => [s.drawerSolid, hovered && { backgroundColor: T.greenDark, transform: [{ scale: 1.02 }] }]} onPress={() => { onClose(); onAuth(); }}>
            <ThemedText style={s.drawerSolidTxt}>Sell Energy</ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 880;

  const [section, setSection]         = useState<Section>('Home');
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [activeHowStep, setActiveHowStep] = useState(0);
  const [activeFlow, setActiveFlow]   = useState<'seller' | 'buyer'>('buyer');
  const [payFlow, setPayFlow]         = useState<'buyer' | 'seller'>('buyer');
  const [payStep, setPayStep]         = useState(0);
  const [showAuth, setShowAuth]       = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const navigateTo = (sec: Section) => {
    setSection(sec);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const steps      = activeFlow === 'seller' ? SELLER_STEPS : BUYER_STEPS;
  const paySteps   = payFlow === 'buyer' ? PAYMENT_BUYER_STEPS : PAYMENT_SELLER_STEPS;
  const curPayStep = paySteps[payStep];
  const currentHow = HOW_STEPS[activeHowStep];
  const padH       = isWide ? 72 : 24;
  const padV       = isWide ? 80 : 56;

  // ── Shared section header ──────────────────────────────────────────────────
  const SectionHeader = ({ badge, title, sub, light = false }: { badge?: string; title: string; sub?: string; light?: boolean }) => (
    <View style={{ alignItems: 'center', marginBottom: 48 }}>
      {badge && (
        <View style={s.badge}>
          <ThemedText style={s.badgeTxt}>{badge}</ThemedText>
        </View>
      )}
      <ThemedText style={[s.h2, light && { color: T.white }]}>{title}</ThemedText>
      {sub && <ThemedText style={[s.h2Sub, light && { color: 'rgba(255,255,255,0.65)' }]}>{sub}</ThemedText>}
    </View>
  );

  return (
    <>
      <AuthModal visible={showAuth} onClose={() => setShowAuth(false)} />
      <MobileDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} activeSection={section} onNav={navigateTo} onAuth={() => setShowAuth(true)} />

      <ScrollView ref={scrollRef} style={s.root} showsVerticalScrollIndicator={false}>

        {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
        <View style={s.navbar}>
          <Pressable style={({hovered}) => [s.logoRow, hovered && { opacity: 0.7 }]} onPress={() => navigateTo('Home')}>
            <Zap size={20} color={T.green} fill={T.green} />
            <ThemedText style={s.logoText}>Yagami</ThemedText>
          </Pressable>

          {isWide ? (
            <View style={s.navLinks}>
              {NAV_LINKS.map(lnk => (
                <Pressable key={lnk} onPress={() => navigateTo(lnk as Section)}>
                  {({ hovered }: { hovered: boolean }) => (
                    <ThemedText style={[s.navLink, section === lnk && s.navLinkActive, hovered && { color: T.green, transform: [{ translateY: -1 }] }]}>{lnk}</ThemedText>
                  )}
                </Pressable>
              ))}
            </View>
          ) : null}

          {isWide ? (
            <View style={s.navCtas}>
              <Pressable style={({hovered}: any) => [s.navBtnOutline, hovered && { backgroundColor: T.greenLight, transform: [{ scale: 1.02 }] }]} onPress={() => setShowAuth(true)}>
                <ThemedText style={s.navBtnOutlineTxt}>Buy Energy</ThemedText>
              </Pressable>
              <Pressable style={({hovered}: any) => [s.navBtnSolid, hovered && { backgroundColor: T.greenDark, transform: [{ scale: 1.02 }] }]} onPress={() => setShowAuth(true)}>
                <ThemedText style={s.navBtnSolidTxt}>Sell Energy</ThemedText>
              </Pressable>
            </View>
          ) : (
            <Pressable style={({hovered}: any) => [s.burger, hovered && { opacity: 0.7 }]} onPress={() => setDrawerOpen(true)}>
              <Menu size={22} color={T.textH} />
            </Pressable>
          )}
        </View>

        {/* ══ HOME ════════════════════════════════════════════════════════════ */}
        {section === 'Home' && (
          <View>
            {/* Hero */}
            <View style={[s.hero, { paddingHorizontal: padH, flexDirection: isWide ? 'row' : 'column' }]}>
              {/* Left */}
              <View style={[s.heroLeft, isWide && { flex: 1, paddingRight: 56 }]}>
                <View style={s.heroPill}>
                  <Leaf size={12} color={T.green} />
                  <ThemedText style={s.heroPillTxt}>India's First P2P Energy Marketplace</ThemedText>
                </View>

                <ThemedText style={[s.heroH1, { fontSize: isWide ? 52 : 36, lineHeight: isWide ? 66 : 50 }]}>
                  Trade Solar Energy{' '}
                  <ThemedText style={{ color: T.green }}>Peer to Peer</ThemedText>
                </ThemedText>

                <ThemedText style={s.heroBody}>
                  Yagami connects rooftop solar owners with local buyers through blockchain-verified, DISCOM-compliant rails — no middleman, instant settlement.
                </ThemedText>

                <View style={[s.heroBtns, !isWide && { flexDirection: 'column' }]}>
                  <Pressable style={({hovered}: any) => [s.btnSolid, !isWide && { width: '100%' }, hovered && { backgroundColor: T.greenDark, transform: [{ scale: 1.02 }] }]} onPress={() => setShowAuth(true)}>
                    <ThemedText style={s.btnSolidTxt}>Get Started</ThemedText>
                    <ArrowRight size={16} color={T.white} />
                  </Pressable>
                  <Pressable style={({hovered}: any) => [s.btnOutline, !isWide && { width: '100%' }, hovered && { backgroundColor: T.greenLight, transform: [{ scale: 1.02 }] }]} onPress={() => navigateTo('How It Works')}>
                    <Play size={13} color={T.green} fill={T.green} />
                    <ThemedText style={s.btnOutlineTxt}>How It Works</ThemedText>
                  </Pressable>
                </View>

                {/* Stats */}
                <View style={[s.statsRow, !isWide && { flexWrap: 'wrap' }]}>
                  {[
                    { val: '500+', label: 'Prosumers' },
                    { val: '12 MWh', label: 'Traded Daily' },
                    { val: '₹4.8', label: 'Avg. Price/kWh' },
                    { val: '3', label: 'DISCOM Partners' },
                  ].map((st, i) => (
                    <View key={st.label} style={[s.statCell, i > 0 && { borderLeftWidth: 1, borderLeftColor: T.border }, !isWide && { width: '50%', borderLeftWidth: 0, borderTopWidth: i >= 2 ? 1 : 0, borderTopColor: T.border }]}>
                      <ThemedText style={s.statVal}>{st.val}</ThemedText>
                      <ThemedText style={s.statLabel}>{st.label}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>

              {/* Right: Live dashboard */}
              {isWide && (
                <View style={s.heroRight}>
                  <HeroDashboard />
                </View>
              )}
            </View>

            {/* Buyer / Seller Flow */}
            <View style={[s.section, s.sectionGreen, { paddingHorizontal: padH }]}>
              <SectionHeader
                badge="Your Journey"
                title="Start Trading in Minutes"
                sub="Choose your role and follow the steps to start buying or selling clean energy today."
              />

              {/* Toggle */}
              <View style={[s.flowToggle, !isWide && { alignSelf: 'stretch' }]}>
                {(['buyer', 'seller'] as const).map(f => (
                  <Pressable
                    key={f}
                    style={({hovered}: any) => [s.flowTab, activeFlow === f && s.flowTabActive, !isWide && { flex: 1 }, hovered && activeFlow !== f && { backgroundColor: 'rgba(0,0,0,0.02)' }]}
                    onPress={() => setActiveFlow(f)}
                  >
                    <ThemedText style={[s.flowTabTxt, activeFlow === f && s.flowTabTxtActive]}>
                      {f === 'buyer' ? '🛒 Buyer Flow' : '☀️ Seller Flow'}
                    </ThemedText>
                    {isWide && (
                      <ThemedText style={[s.flowTabSub, activeFlow === f && { color: T.white }]}>
                        {f === 'buyer' ? 'How to purchase energy' : 'How to sell your solar'}
                      </ThemedText>
                    )}
                  </Pressable>
                ))}
              </View>

              {/* Cards */}
              <View style={[s.flowGrid, isWide && { flexDirection: 'row', flexWrap: 'wrap' }]}>
                {steps.map((st, i) => (
                  <View key={st.step} style={[s.flowCard, isWide && { flex: 1, minWidth: 160 }]}>
                    <View style={[s.flowCardNum, { backgroundColor: T.green }]}>
                      <ThemedText style={s.flowCardNumTxt}>{st.step}</ThemedText>
                    </View>
                    <View style={s.flowCardIcon}>{st.icon}</View>
                    <ThemedText style={s.flowCardTitle}>{st.title}</ThemedText>
                    <ThemedText style={s.flowCardDesc}>{st.desc}</ThemedText>
                  </View>
                ))}
              </View>

              <Pressable style={({hovered}: any) => [s.btnSolid, hovered && { backgroundColor: T.greenDark, transform: [{ scale: 1.02 }] }]} onPress={() => setShowAuth(true)}>
                <ThemedText style={s.btnSolidTxt}>{activeFlow === 'seller' ? 'Start Selling Energy' : 'Find Energy Near You'}</ThemedText>
                <ArrowRight size={16} color={T.white} />
              </Pressable>
            </View>
          </View>
        )}

        {/* ══ HOW IT WORKS ════════════════════════════════════════════════════ */}
        {section === 'How It Works' && (
          <View>
            {/* Stepper */}
            <View style={[s.section, { paddingHorizontal: padH }]}>
              <SectionHeader badge="Platform Walkthrough" title="How Yagami Works" sub="Five simple steps from registration to payment — get trading in minutes." />

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
                {HOW_STEPS.map((step, i) => (
                  <Pressable key={i} style={({hovered}: any) => [s.stepPill, activeHowStep === i && s.stepPillActive, activeHowStep === i && { borderColor: step.color }, hovered && activeHowStep !== i && { backgroundColor: '#f1f5f9', transform: [{ scale: 1.02 }] }]} onPress={() => setActiveHowStep(i)}>
                    <View style={[s.stepCircle, { backgroundColor: step.color }]}>
                      <ThemedText style={s.stepCircleTxt}>{step.num}</ThemedText>
                    </View>
                    <ThemedText style={[s.stepPillLabel, activeHowStep === i && { color: T.textH, fontWeight: '700' }]}>{step.label}</ThemedText>
                  </Pressable>
                ))}
              </View>

              <View style={[s.howCard, isWide && { flexDirection: 'row', gap: 48, alignItems: 'center' }]}>
                <View style={isWide ? { flex: 1 } : {}}>
                  <View style={[s.howIconBadge, { borderColor: currentHow.color + '44' }]}>{currentHow.icon}</View>
                  <ThemedText style={s.howStepLabel}>{currentHow.stepLabel}</ThemedText>
                  <ThemedText style={[s.howTitle, !isWide && { fontSize: 22 }]}>{currentHow.label}</ThemedText>
                  <ThemedText style={s.howDesc}>{currentHow.desc}</ThemedText>
                  <View style={{ gap: 10, marginBottom: 28 }}>
                    {currentHow.bullets.map((b, i) => (
                      <View key={i} style={s.bullet}>
                        <CheckCircle2 size={16} color={T.green} />
                        <ThemedText style={s.bulletTxt}>{b}</ThemedText>
                      </View>
                    ))}
                  </View>
                  <View style={s.divider} />
                  <Pressable style={({hovered}: any) => [s.btnSolid, hovered && { backgroundColor: T.greenDark, transform: [{ scale: 1.02 }] }]} onPress={() => { if (activeHowStep < HOW_STEPS.length - 1) setActiveHowStep(p => p + 1); else setShowAuth(true); }}>
                    <ThemedText style={s.btnSolidTxt}>{activeHowStep < HOW_STEPS.length - 1 ? 'Next Step' : 'Get Started'}</ThemedText>
                    <ArrowRight size={16} color={T.white} />
                  </Pressable>
                </View>
                {isWide && (
                  <View style={[s.howPreviewPanel, { borderColor: currentHow.color + '33' }]}>
                    <View style={[s.howPreviewCircle, { borderColor: currentHow.color + '55' }]}>
                      <View style={[s.howPreviewCircleInner, { backgroundColor: currentHow.color }]}>
                        {React.isValidElement(currentHow.icon) ? React.cloneElement(currentHow.icon as React.ReactElement<any>, { color: T.white, size: 40 }) : currentHow.icon}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Trading Flow Timeline */}
            <View style={[s.section, s.sectionGreen, { paddingHorizontal: padH }]}>
              <SectionHeader title="Complete Trading Flow" sub="A detailed breakdown of every stage in the P2P energy trading process." />
              <View style={{ width: '100%', maxWidth: 700 }}>
                {TRADING_FLOW.map((item, i) => (
                  <View key={i} style={s.tlRow}>
                    <View style={s.tlLeft}>
                      <View style={s.tlCircle}><ThemedText style={s.tlNum}>{item.num}</ThemedText></View>
                      {i < TRADING_FLOW.length - 1 && <View style={s.tlLine} />}
                    </View>
                    <View style={s.tlCard}>
                      <ThemedText style={s.tlTitle}>{item.title}</ThemedText>
                      {item.bullets.map((b, j) => (
                        <View key={j} style={s.tlBullet}>
                          <ChevronRight size={13} color={T.green} />
                          <ThemedText style={s.tlBulletTxt}>{b}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Buyer/Seller cards */}
            <View style={[s.section, s.sectionDark, { paddingHorizontal: padH }]}>
              <SectionHeader light badge="Your Journey" title="Start Trading in Minutes" sub="Choose your role and follow the steps." />
              <View style={[s.flowToggle, !isWide && { alignSelf: 'stretch' }]}>
                {(['buyer', 'seller'] as const).map(f => (
                  <TouchableOpacity key={f} style={[s.flowTab, activeFlow === f && s.flowTabActive, !isWide && { flex: 1 }]} onPress={() => setActiveFlow(f)}>
                    <ThemedText style={[s.flowTabTxt, activeFlow === f && s.flowTabTxtActive]}>{f === 'buyer' ? '🛒 Buyer Flow' : '☀️ Seller Flow'}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[s.flowGrid, isWide && { flexDirection: 'row', flexWrap: 'wrap' }]}>
                {steps.map((st, i) => (
                  <View key={st.step} style={[s.flowCardDark, isWide && { flex: 1, minWidth: 160 }]}>
                    <View style={[s.flowCardNum, { backgroundColor: T.green }]}><ThemedText style={s.flowCardNumTxt}>{st.step}</ThemedText></View>
                    <View style={s.flowCardIcon}>{st.icon}</View>
                    <ThemedText style={[s.flowCardTitle, { color: T.white }]}>{st.title}</ThemedText>
                    <ThemedText style={[s.flowCardDesc, { color: 'rgba(255,255,255,0.55)' }]}>{st.desc}</ThemedText>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={s.btnSolid} onPress={() => setShowAuth(true)}>
                <ThemedText style={s.btnSolidTxt}>{activeFlow === 'seller' ? 'Start Selling Energy' : 'Find Energy Near You'}</ThemedText>
                <ArrowRight size={16} color={T.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ══ DISCOMs ══════════════════════════════════════════════════════════ */}
        {section === 'DISCOMs' && (
          <View>
            <View style={[s.section, { paddingHorizontal: padH }]}>
              <SectionHeader title="Select Your DISCOM" sub="Currently live in Delhi NCR and Western UP. More regions coming soon." />
              <View style={[s.cardRow, isWide && { flexDirection: 'row' }]}>
                {DISCOM_DATA.map(d => (
                  <View key={d.name} style={[s.discomCard, { borderTopColor: d.color, borderTopWidth: 3 }, isWide && { flex: 1 }]}>
                    <View style={[s.discomIcon, { backgroundColor: d.color + '18' }]}><Zap size={20} color={d.color} /></View>
                    <View style={[s.pill, { backgroundColor: d.color + '18', borderColor: d.color + '44' }]}>
                      <ThemedText style={[s.pillTxt, { color: d.color }]}>{d.region}</ThemedText>
                    </View>
                    <ThemedText style={s.discomName}>{d.name}</ThemedText>
                    <ThemedText style={s.discomFull}>{d.fullName}</ThemedText>
                    <ThemedText style={s.discomDesc}>{d.desc}</ThemedText>
                    <ThemedText style={s.areaLabel}>COVERAGE AREAS</ThemedText>
                    <View style={s.areaTags}>
                      {d.areas.map(a => <View key={a} style={s.areaTag}><ThemedText style={s.areaTagTxt}>{a}</ThemedText></View>)}
                    </View>
                    <TouchableOpacity style={[s.btnSolid, { backgroundColor: d.color, marginTop: 8 }]}>
                      <ArrowRight size={13} color={T.white} />
                      <ThemedText style={s.btnSolidTxt}>{d.portal}</ThemedText>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* VC Section */}
            <View style={[s.section, s.sectionGreen, { paddingHorizontal: padH }]}>
              <View style={[s.vcRow, isWide && { flexDirection: 'row', gap: 48 }]}>
                <View style={isWide ? { flex: 1 } : {}}>
                  <View style={s.badge}><ThemedText style={s.badgeTxt}>VERIFICATION PROCESS</ThemedText></View>
                  <ThemedText style={[s.h2, { textAlign: 'left', fontSize: isWide ? 28 : 22 }]}>How Does P2P Trading Work Step by Step</ThemedText>
                  <ThemedText style={[s.h2Sub, { textAlign: 'left', marginBottom: 32 }]}>This process feels like buying and selling commodities — but for electricity — with real-time settlement based on smart meter data.</ThemedText>
                  {VERIFICATION_STEPS.map(vs => (
                    <View key={vs.num} style={s.vsRow}>
                      <View style={s.vsCircle}><ThemedText style={s.vsNum}>{vs.num}</ThemedText></View>
                      <View style={{ flex: 1 }}>
                        <ThemedText style={s.vsTitle}>{vs.title}</ThemedText>
                        <ThemedText style={s.vsDesc}>{vs.desc}</ThemedText>
                      </View>
                    </View>
                  ))}
                </View>
                <View style={[s.vcCard, isWide && { flex: 1 }]}>
                  <ThemedText style={s.vcCardTitle}>Verifiable Credentials Explained</ThemedText>
                  <ThemedText style={s.vcCardDesc}>A Verifiable Credential (VC) is a tamper-proof digital certificate issued by your DISCOM that proves your eligibility for P2P trading — without sharing sensitive personal data with third parties.</ThemedText>
                  {['Issued directly by your DISCOM authority', 'Cryptographically signed — cannot be forged', 'Confirms active electricity connection', 'Enables inter-DISCOM trading across state borders', 'One-time verification — valid for the trading period'].map((b, i) => (
                    <View key={i} style={s.bullet}><CheckCircle2 size={15} color={T.green} /><ThemedText style={s.bulletTxt}>{b}</ThemedText></View>
                  ))}
                  <View style={s.infoBox}><ThemedText style={s.infoBoxTxt}>Based on India Energy Stack (IES) — the same open-protocol infrastructure that powers digital identity and payments across India, now applied to energy trading.</ThemedText></View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ══ PAYMENT FLOW ════════════════════════════════════════════════════ */}
        {section === 'Payment Flow' && (
          <View>
            <View style={[s.section, { paddingHorizontal: padH }]}>
              <SectionHeader title="Money & Energy Flow Overview" sub="How value moves between all parties in a P2P energy trade." />

              <View style={s.moneyCard}>
                <View style={[s.moneyGrid, isWide && { flexDirection: 'row' }]}>
                  {[
                    { icon: <FilePen size={24} color="#0ea5e9" />, bg: '#e0f2fe', title: 'Consumer (Buyer)', rows: [{ e: '💰', t: 'Pays via Wallet' }, { e: '⚡', t: 'Receives Energy Units' }, { e: '📋', t: 'Bill Credited by DISCOM' }] },
                    { icon: <Zap size={30} color={T.white} fill={T.white} />, bg: T.green, title: 'Yagami Platform', center: true, sub: 'India Energy Stack', rows: [{ e: '📊', t: 'Matches Buyers & Sellers' }, { e: '🔄', t: 'Creates Trade Orders' }, { e: '💰', t: 'T+2 Payment Settlement' }, { e: '🔌', t: 'DISCOM Integration' }] },
                    { icon: <Leaf size={24} color="#059669" />, bg: '#d1fae5', title: 'Prosumer (Seller)', rows: [{ e: '☀️', t: 'Generates Solar Energy' }, { e: '💚', t: 'Receives Payout T+2' }, { e: '📋', t: 'Bill Debited by DISCOM' }] },
                  ].map((col, ci) => (
                    <View key={ci} style={[s.moneyCol, isWide && { flex: 1 }]}>
                      <View style={[s.moneyIconBox, { backgroundColor: col.bg, width: col.center ? 68 : 52, height: col.center ? 68 : 52, borderRadius: col.center ? 20 : 14 }]}>{col.icon}</View>
                      <ThemedText style={[s.moneyColTitle, col.center && { fontWeight: '900' }]}>{col.title}</ThemedText>
                      {col.sub && <ThemedText style={s.moneySub}>{col.sub}</ThemedText>}
                      {col.rows.map(r => <View key={r.t} style={s.moneyTag}><ThemedText style={s.moneyTagTxt}>{r.e} {r.t}</ThemedText></View>)}
                    </View>
                  ))}
                </View>
                <View style={s.settlementBar}>
                  <ThemedText style={s.settlementLabel}>SETTLEMENT LAYER</ThemedText>
                  <ThemedText style={s.settlementTxt}>DISCOM (BRPL / Tata Power DDL / PVVNL) — Smart Meters verify & adjust electricity bills</ThemedText>
                </View>
              </View>

              {/* Stepper */}
              <View style={{ width: '100%', maxWidth: 900, marginTop: 60 }}>
                <View style={[s.payToggle, !isWide && { alignSelf: 'stretch' }]}>
                  {(['buyer', 'seller'] as const).map(f => (
                    <Pressable key={f} style={({hovered}: any) => [s.payToggleTab, payFlow === f && s.payToggleTabActive, !isWide && { flex: 1 }, hovered && payFlow !== f && { backgroundColor: 'rgba(0,0,0,0.02)' }]} onPress={() => { setPayFlow(f); setPayStep(0); }}>
                      <ThemedText style={[s.payToggleTxt, payFlow === f && s.payToggleTxtActive]}>{f === 'buyer' ? '🛒 Buyer Flow' : '☀️ Seller Flow'}</ThemedText>
                      <ThemedText style={s.payToggleSub}>{f === 'buyer' ? 'How to purchase energy' : 'How to sell your solar'}</ThemedText>
                    </Pressable>
                  ))}
                </View>

                <View style={[s.payContent, isWide && { flexDirection: 'row', gap: 24 }]}>
                  <View style={s.payList}>
                    {paySteps.map((ps, i) => (
                      <Pressable key={i} style={({hovered}: any) => [s.payListItem, payStep === i && s.payListItemActive, payStep === i && { borderColor: ps.color }, hovered && payStep !== i && { backgroundColor: '#f9fafb' }]} onPress={() => setPayStep(i)}>
                        <View style={[s.payCircle, { backgroundColor: ps.color }]}><ThemedText style={s.payCircleTxt}>{ps.num}</ThemedText></View>
                        <View>
                          <ThemedText style={s.paySmall}>Step {ps.num}</ThemedText>
                          <ThemedText style={[s.payItemLabel, payStep === i && { fontWeight: '800', color: T.textH }]}>{ps.label}</ThemedText>
                        </View>
                      </Pressable>
                    ))}
                  </View>

                  <View style={s.payDetail}>
                    <View style={[s.payDetailIcon, { backgroundColor: curPayStep.color + '18' }]}>{curPayStep.icon}</View>
                    <ThemedText style={s.payDetailStep}>{curPayStep.stepLabel}</ThemedText>
                    <ThemedText style={s.payDetailTitle}>{curPayStep.label}</ThemedText>
                    <ThemedText style={s.payDetailDesc}>{curPayStep.desc}</ThemedText>
                    <View style={s.infoBox}><ThemedText style={s.infoBoxTxt}>{curPayStep.info}</ThemedText></View>
                    <Pressable style={({hovered}: any) => [s.btnSolid, { backgroundColor: curPayStep.color }, hovered && { opacity: 0.85, transform: [{ scale: 1.02 }] }]} onPress={() => { if (payStep < paySteps.length - 1) setPayStep(p => p + 1); else setShowAuth(true); }}>
                      <ThemedText style={s.btnSolidTxt}>{payStep < paySteps.length - 1 ? 'Next' : 'Get Started'}</ThemedText>
                      <ArrowRight size={15} color={T.white} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ══ BLOG / ABOUT ════════════════════════════════════════════════════ */}
        {(section === 'Blog' || section === 'About') && (
          <View style={[s.section, { minHeight: 400, justifyContent: 'center', alignItems: 'center' }]}>
            <Zap size={48} color={T.green} />
            <ThemedText style={[s.h2, { marginTop: 24 }]}>{section}</ThemedText>
            <ThemedText style={s.h2Sub}>This section is coming soon. Check back later!</ThemedText>
          </View>
        )}

        {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
        <View style={s.footerRoot}>
          <View style={[s.footerContainer, !isWide && { flexDirection: 'column', gap: 40 }]}>
            {/* Left Col */}
            <View style={s.footColLeft}>
              <View style={s.logoRow}>
                <Zap size={22} color={T.white} fill={T.white} />
                <ThemedText style={s.footLogoTxt}>Yagami</ThemedText>
              </View>
              <ThemedText style={s.footBy}>BY YELLOW HAZE SUSTAINABLE</ThemedText>
              <ThemedText style={s.footDesc}>
                Peer-to-peer energy trading platform built on India Energy Stack. 
                Empowering clean energy adoption across India.
              </ThemedText>
              <View style={s.footSocials}>
                {[MessageCircle, Linkedin, Twitter, Instagram, Facebook].filter(Boolean).map((Icon: any, i) => (
                  <Pressable key={i} style={({ hovered }: { hovered: boolean }) => [s.socialIcon, hovered && { backgroundColor: T.green }]}>
                    {({ hovered }: { hovered: boolean }) => <Icon size={16} color={hovered ? "#fff" : "#cbd5e1"} />}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Links Cols */}
            <View style={[s.footColLinks, !isWide && { flexDirection: 'column', gap: 40 }]}>
              <View style={s.footLinkGroup}>
                <ThemedText style={s.footHeading}>USEFUL LINKS</ThemedText>
                {['Home', 'How It Works', 'Join', 'DISCOM Portals'].map((item, i) => (
                  <Pressable key={i}>
                    {({ hovered }: { hovered: boolean }) => (
                      <ThemedText style={[s.footLink, hovered && { color: T.white }]}>{item}</ThemedText>
                    )}
                  </Pressable>
                ))}
              </View>
              <View style={s.footLinkGroup}>
                <ThemedText style={s.footHeading}>COMPANY</ThemedText>
                {['About', 'Resources', 'Contact Us'].map((item, i) => (
                  <Pressable key={i}>
                    {({ hovered }: { hovered: boolean }) => (
                      <ThemedText style={[s.footLink, hovered && { color: T.white }]}>{item}</ThemedText>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Right Col */}
            <View style={s.footColRight}>
              <ThemedText style={s.footHeading}>CONTACT</ThemedText>
              <Pressable style={s.footContactRow}>
                {({ hovered }: { hovered: boolean }) => (
                  <>
                    {Mail ? <Mail size={16} color={hovered ? T.white : "#cbd5e1"} /> : null}
                    <ThemedText style={[s.footContactTxt, hovered && { color: T.white }]}>p2p@yagami.in</ThemedText>
                  </>
                )}
              </Pressable>
              <Pressable style={s.footContactRow}>
                {({ hovered }: { hovered: boolean }) => (
                  <>
                    {Phone ? <Phone size={16} color={hovered ? T.white : "#cbd5e1"} /> : null}
                    <ThemedText style={[s.footContactTxt, hovered && { color: T.white }]}>+91-9462878912</ThemedText>
                  </>
                )}
              </Pressable>
              <ThemedText style={[s.footHeading, { marginTop: 16, textTransform: 'none' }]}>Mobile Apps</ThemedText>
              <View style={s.footAppBtns}>
                <Pressable style={({ hovered }: { hovered: boolean }) => [s.appBtn, hovered && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  {Play ? <Play size={14} color="#fff" fill="#fff" /> : null}
                  <ThemedText style={s.appBtnTxt}>Android</ThemedText>
                </Pressable>
                <Pressable style={({ hovered }: { hovered: boolean }) => [s.appBtn, hovered && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  {Smartphone ? <Smartphone size={14} color="#fff" /> : null}
                  <ThemedText style={s.appBtnTxt}>iOS</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Bottom Bar */}
          <View style={[s.footBottom, !isWide && { flexDirection: 'column', gap: 16, alignItems: 'flex-start' }]}>
            <ThemedText style={s.footCopy}>© 2026 Yellow Haze Sustainable. All rights reserved.</ThemedText>
            <View style={s.footLegal}>
              {['Refund Policy', 'Privacy Policy', 'Terms of Use'].map((item, i) => (
                <Pressable key={i}>
                  {({ hovered }: { hovered: boolean }) => (
                    <ThemedText style={[s.footCopy, hovered && { color: T.white }]}>{item}</ThemedText>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 12,
  elevation: 3,
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },

  // ── Drawer
  drawerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 1000 },
  drawer: { position: 'absolute', top: 0, right: 0, bottom: 0, width: 280, backgroundColor: T.white, borderLeftWidth: 1, borderLeftColor: T.border, paddingTop: 60, paddingHorizontal: 24, paddingBottom: 40, ...shadow },
  drawerClose: { position: 'absolute', top: 18, right: 18, width: 36, height: 36, borderRadius: 18, backgroundColor: T.bg, borderWidth: 1, borderColor: T.border, justifyContent: 'center', alignItems: 'center' },
  drawerLinks: { gap: 4, marginTop: 24, marginBottom: 36 },
  drawerLink: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10 },
  drawerLinkActive: { backgroundColor: T.greenBg },
  drawerLinkText: { fontSize: 15, color: T.textB, fontWeight: '500' },
  drawerLinkTextActive: { color: T.greenDark, fontWeight: '700' },
  drawerCtaGroup: { gap: 10 },
  drawerOutline: { height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: T.green, justifyContent: 'center', alignItems: 'center' },
  drawerOutlineTxt: { fontSize: 14, fontWeight: '700', color: T.green },
  drawerSolid: { height: 46, borderRadius: 23, backgroundColor: T.green, justifyContent: 'center', alignItems: 'center' },
  drawerSolidTxt: { fontSize: 14, fontWeight: '700', color: T.white },

  // ── Navbar
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28, paddingVertical: 16, backgroundColor: T.white, borderBottomWidth: 1, borderBottomColor: T.border, ...shadow },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5, color: T.textH },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: 28 },
  navLink: { fontSize: 14, color: T.textB, fontWeight: '500' },
  navLinkActive: { color: T.green, fontWeight: '700' },
  navCtas: { flexDirection: 'row', gap: 10 },
  navBtnOutline: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 22, borderWidth: 1.5, borderColor: T.green },
  navBtnOutlineTxt: { fontSize: 13, fontWeight: '700', color: T.green },
  navBtnSolid: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 22, backgroundColor: T.green },
  navBtnSolidTxt: { fontSize: 13, fontWeight: '700', color: T.white },
  burger: { width: 40, height: 40, borderRadius: 10, backgroundColor: T.bg, borderWidth: 1, borderColor: T.border, justifyContent: 'center', alignItems: 'center' },

  // ── Hero
  hero: { backgroundColor: T.white, paddingTop: 72, paddingBottom: 64, alignItems: 'center' },
  heroLeft: { justifyContent: 'center' },
  heroRight: { width: 400 },
  heroPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: T.greenLight, borderWidth: 1, borderColor: '#86efac', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 28, alignSelf: 'flex-start' },
  heroPillTxt: { fontSize: 12, fontWeight: '700', color: T.greenDark, letterSpacing: 0.3 },
  heroH1: { fontWeight: '900', color: T.textH, letterSpacing: -1.2, marginBottom: 20 },
  heroBody: { fontSize: 16, color: T.textMuted, lineHeight: 26, maxWidth: 480, marginBottom: 40 },
  heroBtns: { flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginBottom: 52 },

  // ── Buttons
  btnSolid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: T.green, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 28 },
  btnSolidTxt: { color: T.white, fontWeight: '800', fontSize: 15 },
  btnOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: T.green, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 28 },
  btnOutlineTxt: { color: T.green, fontWeight: '700', fontSize: 15 },

  // ── Stats
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: T.border, paddingTop: 32 },
  statCell: { paddingHorizontal: 24, paddingVertical: 4 },
  statVal: { fontSize: 26, fontWeight: '900', color: T.textH },
  statLabel: { fontSize: 12, color: T.textMuted, marginTop: 2 },

  // ── Dashboard
  dashWrap: { gap: 12 },
  dashRow: { flexDirection: 'row', gap: 12 },
  dashStatCard: { flex: 1, borderRadius: 16, padding: 16, gap: 6, borderWidth: 1, ...shadow },
  dashStatVal: { fontSize: 20, fontWeight: '900', color: T.textH },
  dashStatLabel: { fontSize: 12, color: T.textMuted },
  dashCard: { backgroundColor: T.white, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, ...shadow },
  dashCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  dashCardTitle: { fontSize: 13, fontWeight: '700', color: T.textH },
  dashLiveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.green },
  dashTradeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  dashAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: T.greenLight, justifyContent: 'center', alignItems: 'center' },
  dashAvatarTxt: { fontSize: 13, fontWeight: '800', color: T.greenDark },
  dashTradeName: { fontSize: 13, fontWeight: '700', color: T.textH },
  dashTradeUnits: { fontSize: 11, color: T.textMuted },
  dashTradePrice: { fontSize: 14, fontWeight: '800', color: T.textH, marginRight: 8 },
  dashStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  dashStatusTxt: { fontSize: 11, fontWeight: '700' },
  dashProgressBg: { height: 7, backgroundColor: T.bg, borderRadius: 4, marginBottom: 8, borderWidth: 1, borderColor: T.border },
  dashProgressFill: { height: 7, backgroundColor: T.green, borderRadius: 4 },
  dashProgressLabel: { fontSize: 12, color: T.textMuted },

  // ── Sections
  section: { paddingVertical: 80, alignItems: 'center', backgroundColor: T.white },
  sectionGreen: { backgroundColor: T.greenBg },
  sectionDark: { backgroundColor: '#0f172a' },

  // ── Badge + headings
  badge: { backgroundColor: T.greenLight, borderWidth: 1, borderColor: '#86efac', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginBottom: 14 },
  badgeTxt: { fontSize: 12, fontWeight: '700', color: T.greenDark, letterSpacing: 0.5 },
  h2: { fontSize: 32, fontWeight: '900', color: T.textH, textAlign: 'center', letterSpacing: -0.6, marginBottom: 12 },
  h2Sub: { fontSize: 15, color: T.textMuted, textAlign: 'center', lineHeight: 25, maxWidth: 600 },
  divider: { height: 1, backgroundColor: T.border, marginBottom: 24 },
  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletTxt: { fontSize: 14, color: T.textB, flex: 1, lineHeight: 21 },

  // ── Step nav
  stepNavScroll: { width: '100%', maxWidth: 900, marginBottom: 28, alignSelf: 'center' },
  stepNavContent: { gap: 12, paddingHorizontal: 4, paddingBottom: 4, justifyContent: 'center', flexGrow: 1 },
  stepPill: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 13, borderRadius: 14, borderWidth: 1.5, borderColor: T.border, backgroundColor: T.white, minWidth: 160, ...shadow },
  stepPillActive: { backgroundColor: T.greenBg },
  stepCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  stepCircleTxt: { color: T.white, fontWeight: '900', fontSize: 13 },
  stepPillLabel: { fontSize: 13, fontWeight: '500', color: T.textMuted, flexShrink: 1 },

  // ── How It Works card
  howCard: { width: '100%', maxWidth: 900, backgroundColor: T.white, borderRadius: 20, padding: 36, borderWidth: 1, borderColor: T.border, ...shadow },
  howIconBadge: { width: 56, height: 56, borderRadius: 14, borderWidth: 2, backgroundColor: T.greenBg, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  howStepLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: T.textMuted, marginBottom: 8 },
  howTitle: { fontSize: 28, fontWeight: '900', color: T.textH, marginBottom: 12 },
  howDesc: { fontSize: 15, color: T.greenDark, lineHeight: 24, marginBottom: 24 },
  howPreviewPanel: { width: 200, height: 200, borderRadius: 24, backgroundColor: T.greenLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, position: 'relative' },
  howPreviewBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: T.green, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  howPreviewBadgeTxt: { fontSize: 11, fontWeight: '800', color: T.white },
  howPreviewCircle: { width: 88, height: 88, borderRadius: 22, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  howPreviewCircleInner: { width: 72, height: 72, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  // ── Timeline
  tlRow: { flexDirection: 'row', gap: 20 },
  tlLeft: { alignItems: 'center', width: 40 },
  tlCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: T.green, justifyContent: 'center', alignItems: 'center' },
  tlNum: { color: T.white, fontWeight: '900', fontSize: 16 },
  tlLine: { flex: 1, width: 2, backgroundColor: '#bbf7d0', marginVertical: 4 },
  tlCard: { flex: 1, backgroundColor: T.white, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: T.border, ...shadow },
  tlTitle: { fontSize: 16, fontWeight: '800', color: T.textH, marginBottom: 10 },
  tlBullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  tlBulletTxt: { fontSize: 13, color: T.textB, flex: 1, lineHeight: 20 },

  // ── Flow cards (light)
  flowToggle: { flexDirection: 'row', backgroundColor: T.bg, borderWidth: 1, borderColor: T.border, borderRadius: 16, padding: 5, gap: 5, marginBottom: 36 },
  flowTab: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 11, alignItems: 'center', minWidth: 130 },
  flowTabActive: { backgroundColor: T.green },
  flowTabTxt: { fontSize: 14, fontWeight: '700', color: T.textMuted },
  flowTabTxtActive: { color: T.white },
  flowTabSub: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  flowGrid: { gap: 14, width: '100%', maxWidth: 1100, marginBottom: 40 },
  flowCard: { backgroundColor: T.white, borderRadius: 18, padding: 22, borderWidth: 1, borderColor: T.border, ...shadow },
  flowCardDark: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  flowCardNum: { width: 26, height: 26, borderRadius: 7, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  flowCardNumTxt: { color: T.white, fontWeight: '900', fontSize: 11 },
  flowCardIcon: { width: 46, height: 46, borderRadius: 12, backgroundColor: T.greenLight, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  flowCardTitle: { fontSize: 14, fontWeight: '800', color: T.textH, marginBottom: 8 },
  flowCardDesc: { fontSize: 13, color: T.textMuted, lineHeight: 20 },

  // ── DISCOMs
  cardRow: { gap: 16, width: '100%', maxWidth: 1100 },
  discomCard: { flex: 1, backgroundColor: T.white, borderRadius: 18, padding: 24, borderWidth: 1, borderColor: T.border, ...shadow },
  discomIcon: { width: 50, height: 50, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  pill: { alignSelf: 'flex-start', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginBottom: 12 },
  pillTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  discomName: { fontSize: 22, fontWeight: '900', color: T.textH, marginBottom: 4 },
  discomFull: { fontSize: 12, color: T.textMuted, marginBottom: 14 },
  discomDesc: { fontSize: 13, color: T.textB, lineHeight: 20, marginBottom: 16 },
  areaLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: T.textMuted, textTransform: 'uppercase', marginBottom: 8 },
  areaTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  areaTag: { backgroundColor: T.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: T.border },
  areaTagTxt: { fontSize: 12, color: T.textB },

  // ── VC Section
  vcRow: { width: '100%', maxWidth: 1100, gap: 28 },
  vcCard: { backgroundColor: T.white, borderRadius: 20, padding: 28, borderWidth: 1, borderColor: T.border, ...shadow },
  vcCardTitle: { fontSize: 18, fontWeight: '900', color: T.textH, marginBottom: 12 },
  vcCardDesc: { fontSize: 14, color: T.textB, lineHeight: 22, marginBottom: 20 },
  vsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 20 },
  vsCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: T.green, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  vsNum: { color: T.white, fontWeight: '900', fontSize: 14 },
  vsTitle: { fontSize: 15, fontWeight: '800', color: T.textH, marginBottom: 4 },
  vsDesc: { fontSize: 13, color: T.textMuted, lineHeight: 20 },
  infoBox: { backgroundColor: T.greenBg, borderRadius: 12, padding: 14, marginTop: 16, borderWidth: 1, borderColor: '#bbf7d0' },
  infoBoxTxt: { fontSize: 12, color: T.textB, lineHeight: 20 },

  // ── Money Flow
  moneyCard: { width: '100%', maxWidth: 920, backgroundColor: T.white, borderRadius: 24, padding: 32, borderWidth: 1, borderColor: T.border, marginBottom: 48, ...shadow },
  moneyGrid: { gap: 20, marginBottom: 28 },
  moneyCol: { alignItems: 'center', gap: 10 },
  moneyIconBox: { justifyContent: 'center', alignItems: 'center' },
  moneyColTitle: { fontSize: 14, fontWeight: '800', color: T.textH, textAlign: 'center' },
  moneySub: { fontSize: 11, color: T.textMuted, textAlign: 'center', marginTop: -6 },
  moneyTag: { backgroundColor: T.bg, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, width: '100%', borderWidth: 1, borderColor: T.border },
  moneyTagTxt: { fontSize: 12, color: T.textB, textAlign: 'center' },
  settlementBar: { backgroundColor: T.navyFoot, borderRadius: 14, paddingVertical: 18, paddingHorizontal: 24, alignItems: 'center', gap: 6 },
  settlementLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' },
  settlementTxt: { fontSize: 14, fontWeight: '700', color: T.white, textAlign: 'center' },

  // ── Payment stepper
  payToggle: { flexDirection: 'row', backgroundColor: T.bg, borderWidth: 1, borderColor: T.border, borderRadius: 16, padding: 5, gap: 5, marginBottom: 32 },
  payToggleTab: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 11, alignItems: 'center', minWidth: 140 },
  payToggleTabActive: { backgroundColor: T.greenLight },
  payToggleTxt: { fontSize: 13, fontWeight: '700', color: T.textMuted },
  payToggleTxtActive: { color: T.greenDark },
  payToggleSub: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  payContent: { width: '100%', gap: 20 },
  payList: { gap: 10, minWidth: 230 },
  payListItem: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: T.white, borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: 'transparent', ...shadow },
  payListItemActive: { backgroundColor: T.greenBg },
  payCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  payCircleTxt: { color: T.white, fontWeight: '900', fontSize: 13 },
  paySmall: { fontSize: 11, color: T.textMuted },
  payItemLabel: { fontSize: 14, fontWeight: '600', color: T.textB },
  payDetail: { flex: 1, backgroundColor: T.white, borderRadius: 20, padding: 28, borderWidth: 1, borderColor: T.border, ...shadow },
  payDetailIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  payDetailStep: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: T.textMuted, marginBottom: 8 },
  payDetailTitle: { fontSize: 24, fontWeight: '900', color: T.textH, marginBottom: 10 },
  payDetailDesc: { fontSize: 15, color: T.greenDark, lineHeight: 24, marginBottom: 20 },

  // ── Footer
  footerRoot: { backgroundColor: '#0f172a', width: '100%' },
  footerContainer: { flexDirection: 'row', width: '100%', maxWidth: 1200, alignSelf: 'center', padding: 60, gap: 40, justifyContent: 'space-between' },
  footColLeft: { flex: 1.5, maxWidth: 320, gap: 14 },
  footLogoTxt: { fontSize: 24, fontWeight: '800', color: T.white, letterSpacing: -0.5 },
  footBy: { fontSize: 11, fontWeight: '800', color: T.green, letterSpacing: 1.2, textTransform: 'uppercase' },
  footDesc: { fontSize: 14, color: '#94a3b8', lineHeight: 22 },
  footSocials: { flexDirection: 'row', gap: 12, marginTop: 4 },
  socialIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  
  footColLinks: { flex: 2, flexDirection: 'row', justifyContent: 'space-around' },
  footLinkGroup: { gap: 14 },
  footHeading: { fontSize: 13, fontWeight: '700', color: T.white, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  footLink: { fontSize: 14, color: '#94a3b8' },
  
  footColRight: { flex: 1, gap: 12 },
  footContactRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  footContactTxt: { fontSize: 14, color: '#94a3b8' },
  footAppBtns: { flexDirection: 'row', gap: 10 },
  appBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  appBtnTxt: { fontSize: 13, fontWeight: '600', color: T.white },
  
  footBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 1200, alignSelf: 'center', paddingHorizontal: 60, paddingVertical: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  footCopy: { fontSize: 13, color: '#64748b' },
  footLegal: { flexDirection: 'row', gap: 24 },
});
