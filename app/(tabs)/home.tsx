import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, Pressable, RefreshControl, PanResponder, type LayoutChangeEvent } from 'react-native';
import { LogOut, ShoppingBag, Store, ShieldCheck, CheckCircle2, Info, ArrowRight, Zap, TrendingUp, Wallet, ArrowRightLeft, UploadCloud, MapPin, LocateFixed, Bell, X, MessageSquare, Flame, BadgePercent, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { ThemedText } from '../../components/ThemedText';
import NearbyMap from '../../components/NearbyMap';
import { TradeChatModal } from '../../components/TradeChatModal';
import { useUserStore, addTrade, resetUserState, updateMarket, updateOnboarding, updateProfile, type UserRole } from '../../constants/userStore';

type NearbyNode = {
  id: string;
  name: string;
  price: string;
  units: string;
  trustScore: number;
  fulfillmentRate: string;
  disputeCount: number;
  responseTime: string;
  latitude: number;
  longitude: number;
};

type NearbyNodeWithDistance = NearbyNode & {
  distanceKm: number;
};

const HYDERABAD_CENTER = {
  latitude: 17.385,
  longitude: 78.4867,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MOCK_NEARBY: Record<'buyer' | 'seller', NearbyNode[]> = {
  buyer: [
    { id: 'S1', name: 'Ravi Solar Hub', price: 'Rs 4.30/kWh', units: '12 kWh', trustScore: 96, fulfillmentRate: '98%', disputeCount: 0, responseTime: '< 3 min', latitude: 17.3925, longitude: 78.4808 },
    { id: 'S2', name: 'Meera Energy', price: 'Rs 4.10/kWh', units: '18 kWh', trustScore: 92, fulfillmentRate: '95%', disputeCount: 1, responseTime: '< 5 min', latitude: 17.3781, longitude: 78.4992 },
    { id: 'S3', name: 'Green Terrace Pvt', price: 'Rs 4.45/kWh', units: '25 kWh', trustScore: 88, fulfillmentRate: '93%', disputeCount: 2, responseTime: '< 7 min', latitude: 17.3708, longitude: 78.4681 },
    { id: 'S4', name: 'SunPeak Co-op', price: 'Rs 4.22/kWh', units: '20 kWh', trustScore: 91, fulfillmentRate: '96%', disputeCount: 1, responseTime: '< 4 min', latitude: 17.4011, longitude: 78.4921 },
    { id: 'S5', name: 'EcoVolt Homes', price: 'Rs 4.18/kWh', units: '16 kWh', trustScore: 89, fulfillmentRate: '94%', disputeCount: 2, responseTime: '< 6 min', latitude: 17.3669, longitude: 78.4978 },
    { id: 'S6', name: 'Harsha Rooftop', price: 'Rs 4.35/kWh', units: '9 kWh', trustScore: 94, fulfillmentRate: '97%', disputeCount: 0, responseTime: '< 3 min', latitude: 17.3822, longitude: 78.4736 },
    { id: 'S7', name: 'GridLeaf Solar', price: 'Rs 4.08/kWh', units: '30 kWh', trustScore: 87, fulfillmentRate: '92%', disputeCount: 2, responseTime: '< 8 min', latitude: 17.3964, longitude: 78.5073 },
    { id: 'S8', name: 'Nexa Green Blocks', price: 'Rs 4.27/kWh', units: '14 kWh', trustScore: 90, fulfillmentRate: '95%', disputeCount: 1, responseTime: '< 5 min', latitude: 17.3745, longitude: 78.4587 },
    { id: 'S9', name: 'Aarav Energy Deck', price: 'Rs 4.14/kWh', units: '11 kWh', trustScore: 85, fulfillmentRate: '90%', disputeCount: 3, responseTime: '< 9 min', latitude: 17.408, longitude: 78.4824 },
    { id: 'S10', name: 'BlueRay Microgrid', price: 'Rs 4.41/kWh', units: '22 kWh', trustScore: 93, fulfillmentRate: '96%', disputeCount: 1, responseTime: '< 4 min', latitude: 17.3601, longitude: 78.4799 },
  ],
  seller: [
    { id: 'B1', name: 'Anita Residency', price: 'Buying Rs 4.25/kWh', units: '10 kWh', trustScore: 94, fulfillmentRate: '97%', disputeCount: 0, responseTime: '< 4 min', latitude: 17.3899, longitude: 78.5031 },
    { id: 'B2', name: 'Cyber Heights', price: 'Buying Rs 4.35/kWh', units: '30 kWh', trustScore: 90, fulfillmentRate: '94%', disputeCount: 1, responseTime: '< 5 min', latitude: 17.373, longitude: 78.4892 },
    { id: 'B3', name: 'Lakeview Towers', price: 'Buying Rs 4.20/kWh', units: '22 kWh', trustScore: 86, fulfillmentRate: '91%', disputeCount: 2, responseTime: '< 8 min', latitude: 17.3982, longitude: 78.467 },
    { id: 'B4', name: 'Madhapur Residences', price: 'Buying Rs 4.40/kWh', units: '18 kWh', trustScore: 92, fulfillmentRate: '96%', disputeCount: 1, responseTime: '< 4 min', latitude: 17.4026, longitude: 78.4715 },
    { id: 'B5', name: 'Nimbus Tech Park', price: 'Buying Rs 4.31/kWh', units: '26 kWh', trustScore: 91, fulfillmentRate: '95%', disputeCount: 1, responseTime: '< 6 min', latitude: 17.3777, longitude: 78.512 },
    { id: 'B6', name: 'Asha Gardens', price: 'Buying Rs 4.16/kWh', units: '12 kWh', trustScore: 88, fulfillmentRate: '93%', disputeCount: 2, responseTime: '< 7 min', latitude: 17.3648, longitude: 78.486 },
    { id: 'B7', name: 'Orbit Crest', price: 'Buying Rs 4.28/kWh', units: '15 kWh', trustScore: 89, fulfillmentRate: '94%', disputeCount: 2, responseTime: '< 5 min', latitude: 17.3915, longitude: 78.4568 },
    { id: 'B8', name: 'Eterna Enclave', price: 'Buying Rs 4.34/kWh', units: '24 kWh', trustScore: 95, fulfillmentRate: '98%', disputeCount: 0, responseTime: '< 3 min', latitude: 17.4067, longitude: 78.4989 },
    { id: 'B9', name: 'Trident Blocks', price: 'Buying Rs 4.12/kWh', units: '9 kWh', trustScore: 84, fulfillmentRate: '90%', disputeCount: 3, responseTime: '< 9 min', latitude: 17.3596, longitude: 78.4689 },
    { id: 'B10', name: 'Skyline Meadows', price: 'Buying Rs 4.22/kWh', units: '28 kWh', trustScore: 93, fulfillmentRate: '97%', disputeCount: 0, responseTime: '< 4 min', latitude: 17.3857, longitude: 78.5234 },
  ],
};

const DEMO_USERS = [
  { id: 'DU1', label: 'Ravi', color: '#1d4ed8' },
  { id: 'DU2', label: 'Meera', color: '#0f766e' },
  { id: 'DU3', label: 'Anita', color: '#7c3aed' },
  { id: 'DU4', label: 'Aarav', color: '#c2410c' },
  { id: 'DU5', label: 'Nexa', color: '#be123c' },
];

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function recenterNodesAroundAnchor(
  nodes: NearbyNode[],
  anchor: { latitude: number; longitude: number }
) {
  const NODE_CLUSTER_SCALE = 0.45;

  // Keep each node's relative position pattern, but shift the whole cluster near user location.
  return nodes.map((node) => ({
    ...node,
    latitude: anchor.latitude + (node.latitude - HYDERABAD_CENTER.latitude) * NODE_CLUSTER_SCALE,
    longitude: anchor.longitude + (node.longitude - HYDERABAD_CENTER.longitude) * NODE_CLUSTER_SCALE,
  }));
}

function parseEnergyKwh(energyLabel: string) {
  const numeric = Number.parseFloat(energyLabel.replace(/[^\d.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isWide = width > 900;
  const isPhone = width < 640;

  const user = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Location not requested yet.');
  const [showNearbyMap, setShowNearbyMap] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeChatNode, setActiveChatNode] = useState<NearbyNode | null>(null);
  const [tradeNotice, setTradeNotice] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [radiusKm, setRadiusKm] = useState(4.5);

  const selectedRole = user.onboarding.selectedRole;
  const isVerified = user.profile.verified;

  const nearbyNodes = useMemo<NearbyNodeWithDistance[]>(() => {
    if (!selectedRole) {
      return [];
    }
    const origin = userCoords || {
      latitude: HYDERABAD_CENTER.latitude,
      longitude: HYDERABAD_CENTER.longitude,
    };

    const anchoredNodes = recenterNodesAroundAnchor(MOCK_NEARBY[selectedRole], origin);

    return anchoredNodes
      .map((node) => ({
        ...node,
        distanceKm: getDistanceKm(origin, node),
      }))
      .filter((node) => node.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [selectedRole, userCoords, radiusKm]);

  const totalNodesForRole = selectedRole ? MOCK_NEARBY[selectedRole].length : 0;

  useEffect(() => {
    if (!selectedNodeId) {
      return;
    }
    const nodeStillVisible = nearbyNodes.some((node) => node.id === selectedNodeId);
    if (!nodeStillVisible) {
      setSelectedNodeId(null);
    }
  }, [nearbyNodes, selectedNodeId]);

  const selectedNode = nearbyNodes.find((node) => node.id === selectedNodeId) || null;
  const marketReference = `Rs ${user.market.livePricePerKwh.toFixed(2)}/kWh`;
  const mapCenter = useMemo(
    () => ({
      latitude: userCoords?.latitude || HYDERABAD_CENTER.latitude,
      longitude: userCoords?.longitude || HYDERABAD_CENTER.longitude,
      latitudeDelta: HYDERABAD_CENTER.latitudeDelta,
      longitudeDelta: HYDERABAD_CENTER.longitudeDelta,
    }),
    [userCoords]
  );

  const recommendation = useMemo(() => {
    if (selectedRole === 'buyer') {
      return 'Price in your area is trending down by 3%. This is a good window to place a buy order.';
    }
    return 'Buyer demand is rising near your location. Keep at least 10 kWh listed to improve fills.';
  }, [selectedRole]);

  const analyticsCards = useMemo(() => {
    const buyerTrades = user.trades.filter((trade) => trade.type === 'bought');
    const sellerTrades = user.trades.filter((trade) => trade.type === 'sold');
    const pendingBuyerTrades = buyerTrades.filter((trade) => trade.status === 'pending').length;
    const pendingSellerTrades = sellerTrades.filter((trade) => trade.status === 'pending').length;
    const monthlyBought = buyerTrades.reduce((sum, trade) => sum + parseEnergyKwh(trade.energy), 0);
    const monthlySold = sellerTrades.reduce((sum, trade) => sum + parseEnergyKwh(trade.energy), 0);

    if (selectedRole === 'buyer') {
      return [
        { label: 'Wallet Balance', val: `Rs ${user.wallet.balance.toLocaleString('en-IN')}`, icon: <Wallet size={18} color="#22c55e" /> },
        { label: 'Monthly Spend', val: `Rs ${user.wallet.monthlySpend.toLocaleString('en-IN')}`, icon: <ArrowRightLeft size={18} color="#3b82f6" /> },
        { label: 'Energy Bought', val: `${monthlyBought.toFixed(1)} kWh`, icon: <TrendingUp size={18} color="#eab308" /> },
        { label: 'Pending Buys', val: `${pendingBuyerTrades}`, icon: <Users size={18} color="#a855f7" /> },
      ];
    }

    return [
      { label: 'Wallet Balance', val: `Rs ${user.wallet.balance.toLocaleString('en-IN')}`, icon: <Wallet size={18} color="#22c55e" /> },
      { label: 'Monthly Earnings', val: `Rs ${user.wallet.monthlyEarnings.toLocaleString('en-IN')}`, icon: <TrendingUp size={18} color="#16a34a" /> },
      { label: 'Energy Sold', val: `${monthlySold.toFixed(1)} kWh`, icon: <ArrowRightLeft size={18} color="#eab308" /> },
      { label: 'Pending Sales', val: `${pendingSellerTrades}`, icon: <Users size={18} color="#3b82f6" /> },
    ];
  }, [selectedRole, user.trades, user.wallet.balance, user.wallet.monthlyEarnings, user.wallet.monthlySpend]);

  const notifications = useMemo(
    () => [
      { id: 'n1', kind: 'price', title: 'Price drop nearby', text: '2 sellers lowered rates by 4% in the last hour.', icon: <BadgePercent size={14} color="#2563eb" /> },
      { id: 'n2', kind: 'match', title: 'New nearby match', text: 'A verified counterparty is now within 0.8 km of your location.', icon: <Users size={14} color="#16a34a" /> },
      { id: 'n3', kind: 'chat', title: 'Chat reply received', text: 'Ravi Solar Hub replied to your latest offer.', icon: <MessageSquare size={14} color="#a855f7" /> },
      { id: 'n4', kind: 'signal', title: 'Market signal', text: 'Live demand is high, so buyers may need to move faster.', icon: <Flame size={14} color="#ea580c" /> },
    ],
    []
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    const nextPrice = Number((user.market.livePricePerKwh + 0.05).toFixed(2));
    updateMarket({
      livePricePerKwh: nextPrice > 4.9 ? 4.1 : nextPrice,
      demandLevel: user.market.demandLevel === 'Normal' ? 'High' : 'Normal',
    });
    setTimeout(() => setIsRefreshing(false), 450);
  };

  const handleRoleSelection = (role: UserRole) => {
    updateOnboarding({
      selectedRole: role,
      credentialFileName: null,
      credentialUri: null,
      verificationState: 'not-started',
    });
    updateProfile({ verified: false });
  };

  const handleCredentialUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: ['application/json', 'image/*'],
      multiple: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];
      updateOnboarding({
        credentialFileName: file.name,
        credentialUri: file.uri,
        verificationState: 'pending',
      });
    }
  };

  const handleUseMockCredential = () => {
    const fileName = selectedRole === 'buyer' ? 'buyer-vc.json' : 'seller-vc.json';
    updateOnboarding({
      credentialFileName: fileName,
      credentialUri: `assets/mock-credentials/${fileName}`,
      verificationState: 'pending',
    });
  };

  const handleCompleteVerification = () => {
    if (!user.onboarding.credentialUri || !selectedRole) {
      return;
    }
    updateOnboarding({ verificationState: 'verified' });
    updateProfile({ verified: true });
  };

  const handleOpenCredentialPortal = async () => {
    const buyerPortal = 'https://www.npci.org.in/what-we-do/upi-id';
    const sellerPortal = 'https://mnre.gov.in/solar/schemes/';
    const targetUrl = selectedRole === 'seller' ? sellerPortal : buyerPortal;
    await Linking.openURL(targetUrl);
  };

  const handleRequestLocationAndShow = async () => {
    setIsLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setLocationStatus('Location access denied. Showing mock nearby data around your city center.');
      setUserCoords({ latitude: HYDERABAD_CENTER.latitude, longitude: HYDERABAD_CENTER.longitude });
      setShowNearbyMap(true);
      setIsLocating(false);
      return;
    }

    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    setLocationStatus(`Location captured at ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}.`);
    setUserCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    setShowNearbyMap(true);
    setIsLocating(false);
  };

  const counterPartyLabel = selectedRole === 'buyer' ? 'sellers' : 'buyers';
  const markerLabel = selectedRole === 'buyer' ? 'S' : 'B';
  const openChatForSelectedNode = () => {
    if (!selectedNode) {
      return;
    }

    setActiveChatNode(selectedNode);
  };

  const lockCurrentPriceAndGoToTrades = () => {
    if (!selectedNode || !selectedRole) {
      return;
    }

    const tradeType = selectedRole === 'buyer' ? 'bought' : 'sold';

    addTrade({
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'pending',
      energy: selectedNode.units,
      price: selectedNode.price,
      type: tradeType,
      counterpart: selectedNode.name,
      dealLockedAt: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      negotiationSource: 'manual',
      chatTranscript: [
        {
          sender: 'counterparty',
          text: `Rate locked at ${selectedNode.price} for ${selectedNode.units}.`,
          at: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
    });

    setTradeNotice(`Locked ${selectedNode.price} with ${selectedNode.name}. Redirecting to Trades.`);
    router.push('/(tabs)/trades');
  };

  return (
    <View style={s.root}>
      <View style={s.topHeader}>
        <View style={s.logoRow}>
          <Zap size={22} color="#22c55e" fill="#22c55e" />
          <ThemedText style={s.logoText}>Yagami</ThemedText>
        </View>
        <View style={s.topRightActions}>
          <Pressable style={({ hovered }: any) => [s.notificationBtn, hovered && { backgroundColor: '#eff6ff' }]} onPress={() => setNotificationsOpen((current) => !current)}>
            <Bell size={18} color="#334155" />
            <View style={s.notificationBadge}><ThemedText style={s.notificationBadgeText}>{notifications.length}</ThemedText></View>
          </Pressable>
          <Pressable
            style={({ hovered }: any) => [s.logoutBtn, hovered && { backgroundColor: '#f1f5f9', borderRadius: 8 }]}
            onPress={() => {
              resetUserState();
              router.push('/');
            }}
          >
            <LogOut size={20} color="#64748b" />
          </Pressable>
        </View>
      </View>

      {notificationsOpen && (
        <View style={s.notificationPanelWrap}>
          <View style={s.notificationPanel}>
            <View style={s.notificationHeader}>
              <View>
                <ThemedText style={s.notificationTitle}>Notifications</ThemedText>
                <ThemedText style={s.notificationSub}>Price drops, matches, and chat replies</ThemedText>
              </View>
              <Pressable onPress={() => setNotificationsOpen(false)} style={s.notificationCloseBtn}>
                <X size={16} color="#334155" />
              </Pressable>
            </View>

            <View style={s.notificationList}>
              {notifications.map((item) => (
                <View key={item.id} style={s.notificationItem}>
                  <View style={s.notificationIcon}>{item.icon}</View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={s.notificationItemTitle}>{item.title}</ThemedText>
                    <ThemedText style={s.notificationItemText}>{item.text}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, isPhone && { paddingHorizontal: 16, paddingTop: 20 }]}
        refreshControl={isVerified ? <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#22c55e" /> : undefined}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.container}>
          {!selectedRole && (
            <>
              <View style={[s.welcomeSection, isWide && { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}> 
                <View>
                  <ThemedText style={[s.welcomeTitle, isPhone && s.welcomeTitlePhone]}>Hello, {user.profile.name}! </ThemedText>
                  <ThemedText style={[s.welcomeSub, isPhone && s.welcomeSubPhone]}>Select your role first. Dashboard appears after verification.</ThemedText>
                </View>
              </View>

              <View style={[s.cardsRow, !isWide && { flexDirection: 'column' }]}> 
                <View style={[s.actionCard, !isWide && { width: '100%' }]}> 
                  <View style={s.cardHeader}>
                    <View style={s.cardIconBox}><ShoppingBag size={20} color="#2563eb" /></View>
                    <View style={s.notVerifiedPill}><ThemedText style={s.notVerifiedTxt}>NOT VERIFIED</ThemedText></View>
                  </View>
                  <ThemedText style={s.cardTitle}>Become a Buyer</ThemedText>
                  <ThemedText style={s.cardDesc}>Verify your consumer meter to buy green energy from nearby verified sellers.</ThemedText>
                  <Pressable style={({ hovered }: any) => [s.cardBtn, hovered && { backgroundColor: '#1d4ed8' }]} onPress={() => handleRoleSelection('buyer')}>
                    <ThemedText style={s.cardBtnTxt}>Start Buyer Verification</ThemedText>
                    <ArrowRight size={16} color="#fff" />
                  </Pressable>
                </View>

                <View style={[s.actionCard, !isWide && { width: '100%' }]}> 
                  <View style={s.cardHeader}>
                    <View style={s.cardIconBox}><Store size={20} color="#d97706" /></View>
                    <View style={s.notVerifiedPill}><ThemedText style={s.notVerifiedTxt}>NOT VERIFIED</ThemedText></View>
                  </View>
                  <ThemedText style={s.cardTitle}>Become a Seller</ThemedText>
                  <ThemedText style={s.cardDesc}>Verify your prosumer account and sell surplus rooftop solar to local buyers.</ThemedText>
                  <Pressable style={({ hovered }: any) => [s.cardBtn, hovered && { backgroundColor: '#1d4ed8' }]} onPress={() => handleRoleSelection('seller')}>
                    <ThemedText style={s.cardBtnTxt}>Start Seller Verification</ThemedText>
                    <ArrowRight size={16} color="#fff" />
                  </Pressable>
                </View>
              </View>

              <View style={[s.banner, !isWide && { flexDirection: 'column', gap: 24 }]}> 
                <View style={s.bannerLeft}>
                  <View style={s.bannerTitleRow}>
                    <ShieldCheck size={20} color="#fff" />
                    <ThemedText style={s.bannerTitle}>Why verify identity?</ThemedText>
                  </View>
                  <ThemedText style={s.bannerDesc}>We use Verifiable Credentials (VC) to cryptographically link your account to your smart meter for secure and traceable trading.</ThemedText>
                </View>
              </View>
            </>
          )}

          {selectedRole && !isVerified && (
            <View style={s.verifyShell}>
              <View style={s.verifyBadge}>
                <ThemedText style={s.verifyBadgeText}>VERIFYING AS</ThemedText>
                <View style={s.verifyRolePill}><ThemedText style={s.verifyRolePillText}>{selectedRole.toUpperCase()}</ThemedText></View>
              </View>

              <ThemedText style={s.verifyTitle}>Upload Credential</ThemedText>
              <ThemedText style={s.verifySub}>Please upload your Verifiable Credential (JSON or image) to link your smart meter.</ThemedText>

              <Pressable style={s.uploadCard} onPress={handleCredentialUpload}>
                <View style={s.uploadIconWrap}><UploadCloud size={32} color="#1d4ed8" /></View>
                <ThemedText style={s.uploadTitle}>Tap to Upload</ThemedText>
                <ThemedText style={s.uploadSub}>JSON or image files (Max 10MB)</ThemedText>
              </Pressable>

              {!!user.onboarding.credentialFileName && (
                <View style={s.fileInfoCard}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <ThemedText style={s.fileInfoText}>Selected: {user.onboarding.credentialFileName}</ThemedText>
                </View>
              )}

              <View style={[s.verifyBtnRow, !isWide && { flexDirection: 'column' }]}> 
                <Pressable style={({ hovered }: any) => [s.mockBtn, hovered && { backgroundColor: '#eff6ff' }]} onPress={handleUseMockCredential}>
                  <ThemedText style={s.mockBtnText}>Use Mock Credential</ThemedText>
                </Pressable>
                <Pressable
                  style={({ hovered }: any) => [s.completeBtn, hovered && { backgroundColor: '#1d4ed8' }, !user.onboarding.credentialUri && s.completeBtnDisabled]}
                  disabled={!user.onboarding.credentialUri}
                  onPress={handleCompleteVerification}
                >
                  <ThemedText style={s.completeBtnText}>Verify and Continue</ThemedText>
                </Pressable>
              </View>

              <View style={s.helpCard}>
                <Info size={16} color="#2563eb" />
                <View style={{ flex: 1 }}>
                  <ThemedText style={s.helpTitle}>Need a Credential?</ThemedText>
                  <ThemedText style={s.helpText}>Use files in assets/mock-credentials for quick testing: buyer-vc.json and seller-vc.json.</ThemedText>
                  <Pressable style={({ hovered }: any) => [s.portalBtn, hovered && { backgroundColor: '#dbeafe' }]} onPress={handleOpenCredentialPortal}>
                    <ThemedText style={s.portalBtnText}>
                      {selectedRole === 'seller' ? 'Open MNRE seller credential portal' : 'Open UPI identity credential portal'}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {selectedRole && isVerified && (
            <>
              <View style={s.verifiedHeader}>
                <View style={s.verifiedIcon}><CheckCircle2 size={32} color="#16a34a" /></View>
                <ThemedText style={s.welcomeTitle}>Welcome back, {user.profile.name.split(' ')[0]}</ThemedText>
                <ThemedText style={s.welcomeSub}>Your {selectedRole} profile is verified and active under {user.profile.discomName}.</ThemedText>
              </View>

              <View style={[s.statGrid, !isWide && { flexDirection: 'column' }]}> 
                {analyticsCards.map((item, i) => (
                  <View key={i} style={s.statCard}>
                    <View style={s.statIcon}>{item.icon}</View>
                    <View>
                      <ThemedText style={s.statLabel}>{item.label}</ThemedText>
                      <ThemedText style={s.statVal}>{item.val}</ThemedText>
                    </View>
                  </View>
                ))}
              </View>

              <View style={s.insightCard}>
                <ThemedText style={s.insightTitle}>Smart Recommendation</ThemedText>
                <ThemedText style={s.insightText}>{recommendation}</ThemedText>
              </View>

              {selectedNode && (
                <View style={s.trustCard}>
                  <View style={s.trustHeader}>
                    <View>
                      <ThemedText style={s.trustTitle}>Counterparty trust snapshot</ThemedText>
                      <ThemedText style={s.trustSub}>{selectedNode.name} is showing these reliability signals right now.</ThemedText>
                    </View>
                    <View style={s.trustScorePill}>
                      <ThemedText style={s.trustScoreText}>{selectedNode.trustScore}</ThemedText>
                    </View>
                  </View>

                  <View style={s.trustGrid}>
                    <TrustMetric label="Fulfillment" value={selectedNode.fulfillmentRate} />
                    <TrustMetric label="Disputes" value={`${selectedNode.disputeCount}`} />
                    <TrustMetric label="Response" value={selectedNode.responseTime} />
                    <TrustMetric label="Current rate" value={selectedNode.price} />
                  </View>
                </View>
              )}

              <View style={s.nearbyCard}>
                {tradeNotice && (
                  <View style={s.tradeNoticeCard}>
                    <ThemedText type="defaultSemiBold">Trade update</ThemedText>
                    <ThemedText style={s.tradeNoticeText}>{tradeNotice}</ThemedText>
                  </View>
                )}

                <View style={[s.nearbyHeader, isPhone && s.nearbyHeaderPhone]}>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={s.nearbyTitle}>Nearby {counterPartyLabel[0].toUpperCase() + counterPartyLabel.slice(1)}</ThemedText>
                    <ThemedText style={s.nearbySub}>{locationStatus}</ThemedText>
                    <ThemedText style={s.nearbyMeta}>Showing {nearbyNodes.length} of {totalNodesForRole} users within {radiusKm.toFixed(1)} km.</ThemedText>
                  </View>
                  <Pressable style={({ hovered }: any) => [s.locateBtn, isPhone && s.locateBtnPhone, hovered && { backgroundColor: '#1d4ed8' }]} onPress={handleRequestLocationAndShow} disabled={isLocating}>
                    <LocateFixed size={14} color="#fff" />
                    <ThemedText style={s.locateTxt}>{isLocating ? 'Locating...' : selectedRole === 'buyer' ? 'See Nearby Sellers' : 'See Nearby Buyers'}</ThemedText>
                  </Pressable>
                </View>

                {showNearbyMap && (
                  <>
                    <View style={s.radiusCard}>
                      <View style={s.radiusHeader}>
                        <ThemedText style={s.radiusTitle}>Search Radius</ThemedText>
                        <ThemedText style={s.radiusValue}>{radiusKm.toFixed(1)} km</ThemedText>
                      </View>
                      <ThemedText style={s.radiusSub}>Drag left or right to control how far users are shown on the map.</ThemedText>
                      <RadiusSlider min={1} max={4.9} step={0.1} value={radiusKm} onChange={setRadiusKm} />
                    </View>

                    <NearbyMap
                      center={mapCenter}
                      markerLabel={markerLabel as 'S' | 'B'}
                      nodes={nearbyNodes}
                      radiusKm={radiusKm}
                      selectedNodeId={selectedNodeId}
                      userCoords={userCoords}
                      onSelectNode={setSelectedNodeId}
                    />

                    <ThemedText style={s.mapHint}>Tap {markerLabel} marker to see details. The dark marker is your location.</ThemedText>

                    {nearbyNodes.length === 0 && (
                      <View style={s.emptyRadiusCard}>
                        <ThemedText style={s.emptyRadiusTitle}>No users in this radius</ThemedText>
                        <ThemedText style={s.emptyRadiusText}>Slide right to increase radius and include more nearby users.</ThemedText>
                        <View style={s.emptyDemoRow}>
                          {DEMO_USERS.map((demoUser) => (
                            <View key={demoUser.id} style={s.emptyDemoItem}>
                              <View style={[s.emptyDemoIcon, { backgroundColor: demoUser.color }]}>
                                <Users size={12} color="#fff" />
                              </View>
                              <ThemedText style={s.emptyDemoLabel}>{demoUser.label}</ThemedText>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {selectedNode && (
                      <View style={s.nodeDetailCard}>
                        <ThemedText style={s.nodeDetailTitle}>{selectedNode.name}</ThemedText>
                        <ThemedText style={s.nodeDetailPrice}>Asking price: {selectedNode.price}</ThemedText>
                        <ThemedText style={s.nodeDetailText}>Current market: {marketReference}</ThemedText>
                        <ThemedText style={s.nodeDetailText}>Available energy: {selectedNode.units}</ThemedText>
                        <ThemedText style={s.nodeDetailText}>Distance: {selectedNode.distanceKm.toFixed(2)} km</ThemedText>
                        <View style={s.nodeTrustRow}>
                          <View style={s.nodeTrustBadge}><ThemedText style={s.nodeTrustBadgeText}>Trust {selectedNode.trustScore}</ThemedText></View>
                          <View style={s.nodeTrustBadge}><ThemedText style={s.nodeTrustBadgeText}>{selectedNode.fulfillmentRate} fill rate</ThemedText></View>
                          <View style={s.nodeTrustBadge}><ThemedText style={s.nodeTrustBadgeText}>{selectedNode.disputeCount} disputes</ThemedText></View>
                        </View>
                        <View style={s.nodeActionRow}>
                          <Pressable style={({ hovered }: any) => [s.chatBtn, hovered && { backgroundColor: '#111827' }]} onPress={lockCurrentPriceAndGoToTrades}>
                            <ThemedText style={s.chatBtnText}>Lock and Confirm</ThemedText>
                          </Pressable>
                          <Pressable style={({ hovered }: any) => [s.secondaryChatBtn, hovered && { backgroundColor: '#eef2ff' }]} onPress={openChatForSelectedNode}>
                            <ThemedText style={s.secondaryChatText}>Negotiate rate</ThemedText>
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {activeChatNode && (
        <TradeChatModal
          visible={!!activeChatNode}
          counterpartName={activeChatNode.name}
          counterpartRole={selectedRole === 'buyer' ? 'seller' : 'buyer'}
          askingPrice={activeChatNode.price}
          energyAmount={activeChatNode.units}
          marketPrice={marketReference}
          onClose={() => setActiveChatNode(null)}
          onCompleteTrade={({ acceptedPrice, counterpartName, negotiationSource, transcript }) => {
            const tradeType = selectedRole === 'buyer' ? 'bought' : 'sold';
            addTrade({
              id: `tx-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              status: 'pending',
              energy: activeChatNode.units,
              price: acceptedPrice,
              type: tradeType,
              counterpart: counterpartName,
              dealLockedAt: new Date().toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              negotiationSource,
              chatTranscript: transcript,
            });
            setTradeNotice(`Locked ${acceptedPrice} with ${counterpartName}. Settlement can now be recorded on-chain.`);
            setActiveChatNode(null);
          }}
        />
      )}
    </View>
  );
}

const s: any = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f9fafb' },
  topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 22, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  logoutBtn: { padding: 8 },
  topRightActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notificationBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  notificationBadge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  notificationBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  notificationPanelWrap: { position: 'absolute', top: 58, right: 14, zIndex: 30, width: 320 },
  notificationPanel: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  notificationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  notificationCloseBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  notificationTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
  notificationSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  notificationList: { gap: 10 },
  notificationItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#f8fafc', borderRadius: 14, padding: 10 },
  notificationIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  notificationItemTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  notificationItemText: { fontSize: 12, color: '#475569', marginTop: 2, lineHeight: 17 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 100 },
  container: { width: '100%', maxWidth: 1000, alignSelf: 'center' },

  welcomeSection: { marginBottom: 40 },
  welcomeTitle: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  welcomeTitlePhone: { fontSize: 24, lineHeight: 30 },
  welcomeSub: { fontSize: 16, color: '#64748b' },
  welcomeSubPhone: { fontSize: 14, lineHeight: 20 },

  cardsRow: { flexDirection: 'row', gap: 24, marginBottom: 32 },
  actionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 24, padding: 28, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  notVerifiedPill: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  notVerifiedTxt: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 0.5 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  cardDesc: { fontSize: 14, color: '#64748b', lineHeight: 22, marginBottom: 24 },
  cardBtn: { width: '100%', height: 50, backgroundColor: '#1e40af', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  cardBtnTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },

  banner: { width: '100%', backgroundColor: '#0f172a', borderRadius: 24, padding: 26, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerLeft: { flex: 1 },
  bannerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  bannerDesc: { fontSize: 14, color: '#94a3b8', lineHeight: 22 },

  verifyShell: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 24, padding: 24 },
  verifyBadge: { flexDirection: 'row', gap: 8, alignItems: 'center', alignSelf: 'center', marginBottom: 14, backgroundColor: '#f8fafc', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  verifyBadgeText: { fontSize: 11, color: '#64748b', fontWeight: '700' },
  verifyRolePill: { backgroundColor: '#dbeafe', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  verifyRolePillText: { fontSize: 12, fontWeight: '800', color: '#1d4ed8' },
  verifyTitle: { textAlign: 'center', fontSize: 22, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
  verifySub: { textAlign: 'center', color: '#64748b', marginBottom: 24, lineHeight: 21 },
  uploadCard: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#bfdbfe', borderRadius: 20, minHeight: 210, justifyContent: 'center', alignItems: 'center', padding: 20, marginBottom: 14 },
  uploadIconWrap: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  uploadTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  uploadSub: { fontSize: 14, color: '#64748b' },
  fileInfoCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#86efac', borderRadius: 12, padding: 12, marginBottom: 14 },
  fileInfoText: { color: '#166534', fontWeight: '600', flex: 1 },
  verifyBtnRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  mockBtn: { flex: 1, height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
  mockBtnText: { color: '#334155', fontWeight: '700' },
  completeBtn: { flex: 1, height: 48, borderRadius: 10, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  completeBtnDisabled: { backgroundColor: '#94a3b8' },
  completeBtnText: { color: '#fff', fontWeight: '800' },
  helpCard: { flexDirection: 'row', gap: 10, backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1, borderRadius: 12, padding: 12 },
  helpTitle: { fontWeight: '800', color: '#1e3a8a', marginBottom: 2 },
  helpText: { fontSize: 12, color: '#334155' },
  portalBtn: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: '#e0e7ff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  portalBtnText: { color: '#1e40af', fontWeight: '800', fontSize: 12 },

  verifiedHeader: { alignItems: 'center', marginBottom: 24, marginTop: 12 },
  verifiedIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statGrid: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', gap: 14 },
  statIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  statVal: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  insightCard: { backgroundColor: '#eef6ff', borderRadius: 16, borderWidth: 1, borderColor: '#dbeafe', padding: 16, marginBottom: 18 },
  insightTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  insightText: { fontSize: 13, color: '#334155', lineHeight: 20 },

  trustCard: { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#e5e7eb', padding: 16, marginBottom: 18 },
  trustHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 },
  trustTitle: { fontSize: 15, fontWeight: '900', color: '#0f172a' },
  trustSub: { fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 18 },
  trustScorePill: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#ecfdf5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#bbf7d0' },
  trustScoreText: { color: '#16a34a', fontWeight: '900', fontSize: 18 },
  trustGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  trustMetricCard: { width: '48%', backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 10 },
  trustMetricLabel: { fontSize: 11, color: '#64748b', marginBottom: 4 },
  trustMetricValue: { fontSize: 13, fontWeight: '800', color: '#0f172a' },

  nearbyCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, padding: 16 },
  tradeNoticeCard: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 14, padding: 12, marginBottom: 12 },
  tradeNoticeText: { marginTop: 4, color: '#166534', fontSize: 12, lineHeight: 18 },
  nearbyHeader: { flexDirection: 'row', gap: 10, marginBottom: 14, alignItems: 'center' },
  nearbyHeaderPhone: { flexDirection: 'column', alignItems: 'stretch' },
  nearbyTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  nearbySub: { fontSize: 12, color: '#64748b', marginTop: 4 },
  nearbyMeta: { fontSize: 12, color: '#0f766e', marginTop: 4, fontWeight: '700' },
  locateBtn: { backgroundColor: '#2563eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  locateBtnPhone: { justifyContent: 'center' },
  locateTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },

  radiusCard: { marginBottom: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#dbeafe', borderRadius: 12, padding: 12 },
  radiusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  radiusTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  radiusValue: { fontSize: 13, fontWeight: '900', color: '#1d4ed8' },
  radiusSub: { marginTop: 5, color: '#475569', fontSize: 12 },
  sliderTrack: { marginTop: 12, height: 32, justifyContent: 'center' },
  sliderBase: { height: 7, borderRadius: 999, backgroundColor: '#cbd5e1' },
  sliderFill: { position: 'absolute', left: 0, top: 12, height: 7, borderRadius: 999, backgroundColor: '#2563eb' },
  sliderThumb: { position: 'absolute', top: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: '#0f172a', borderWidth: 2, borderColor: '#fff' },

  emptyRadiusCard: { marginTop: 10, backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', borderRadius: 12, padding: 12 },
  emptyRadiusTitle: { color: '#92400e', fontWeight: '900', marginBottom: 3 },
  emptyRadiusText: { color: '#78350f', fontSize: 12 },
  emptyDemoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  emptyDemoItem: { alignItems: 'center', gap: 4 },
  emptyDemoIcon: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  emptyDemoLabel: { fontSize: 11, color: '#92400e', fontWeight: '700' },

  mapHint: { marginTop: 10, color: '#64748b', fontSize: 12 },
  nodeDetailCard: { marginTop: 10, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12 },
  nodeDetailTitle: { fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  nodeDetailPrice: { fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  nodeDetailText: { color: '#475569', fontSize: 12 },
  nodeTrustRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  nodeTrustBadge: { backgroundColor: '#eef2ff', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  nodeTrustBadgeText: { color: '#3730a3', fontWeight: '800', fontSize: 11 },
  nodeActionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  chatBtn: { backgroundColor: '#0f172a', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  chatBtnText: { color: '#fff', fontWeight: '800' },
  secondaryChatBtn: { backgroundColor: '#e0e7ff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  secondaryChatText: { color: '#3730a3', fontWeight: '800' },
});

function TrustMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.trustMetricCard}>
      <ThemedText style={s.trustMetricLabel}>{label}</ThemedText>
      <ThemedText style={s.trustMetricValue}>{value}</ThemedText>
    </View>
  );
}

function RadiusSlider({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (nextValue: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(1);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clamp = (rawValue: number) => {
    const safe = Math.max(min, Math.min(max, rawValue));
    const snapped = Math.round((safe - min) / step) * step + min;
    return Number(snapped.toFixed(2));
  };

  const percent = (value - min) / (max - min);
  const knobLeft = Math.max(0, Math.min(trackWidth - 22, percent * trackWidth - 11));

  const applyFromPosition = (x: number) => {
    if (trackWidth <= 0) {
      return;
    }
    const boundedX = Math.max(0, Math.min(trackWidth, x));
    const nextRaw = min + (boundedX / trackWidth) * (max - min);
    const nextValue = clamp(nextRaw);
    if (nextValue !== valueRef.current) {
      onChange(nextValue);
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          applyFromPosition(event.nativeEvent.locationX);
        },
        onPanResponderMove: (event) => {
          applyFromPosition(event.nativeEvent.locationX);
        },
      }),
    [trackWidth, min, max, step]
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={s.sliderTrack} onLayout={handleLayout} {...panResponder.panHandlers}>
      <View style={s.sliderBase} />
      <View style={[s.sliderFill, { width: Math.max(0, Math.min(trackWidth, percent * trackWidth)) }]} />
      <View style={[s.sliderThumb, { left: knobLeft }]} />
    </View>
  );
}
