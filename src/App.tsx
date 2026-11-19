import { VERIFIED_UNITS, type OperationalUnit } from './lib/units';
import React, { useState, useEffect, useCallback } from 'react';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { TopBar } from './components/TopBar';
import { Dock } from './components/Dock';
import { AppLauncher } from './components/AppLauncher';
import { WidgetsPanel } from './components/WidgetsPanel';
import { AppWindow } from './components/AppWindow';
import { SettingsModal } from './components/SettingsModal';
import { ControlCenter } from './components/ControlCenter';
import { SpotlightSearch } from './components/SpotlightSearch';
import { NotificationCenter } from './components/NotificationCenter';

import { 
  ProductApp, 
  SalesMetricData, 
  ReservationMetricData, 
  OperationalMetricData, 
  EventLog, 
  SupabaseConfig,
  ActiveView 
} from './types';
import { 
  supabaseService, 
  loadStoredConfig
} from './lib/supabase';
import { 
  INITIAL_PRODUCTS, 
  PIPOU_PLATFORM_URL,
  INITIAL_SALES_METRIC, 
  INITIAL_RESERVATION_METRIC, 
  INITIAL_OPERATIONAL_METRIC, 
  INITIAL_EVENTS 
} from './lib/mockData';
import { soundManager } from './lib/sound';

export function App() {
  const [units, setUnits] = useState<OperationalUnit[]>(VERIFIED_UNITS);
  const [selectedUnitId, setSelectedUnitId] = useState('all');

  // State: Data & Metrics
  const [products, setProducts] = useState<ProductApp[]>(INITIAL_PRODUCTS);
  const [salesData, setSalesData] = useState<SalesMetricData>(INITIAL_SALES_METRIC);
  const [reservationData, setReservationData] = useState<ReservationMetricData>(INITIAL_RESERVATION_METRIC);
  const [operationalData, setOperationalData] = useState<OperationalMetricData>(INITIAL_OPERATIONAL_METRIC);
  const [eventsData, setEventsData] = useState<EventLog[]>(INITIAL_EVENTS);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(loadStoredConfig());

  // State: App UI & Windows
  const [activeView, setActiveView] = useState<ActiveView>('split');
  const [activeProductWindow, setActiveProductWindow] = useState<ProductApp | null>(null);
  const [minimizedWindowIds, setMinimizedWindowIds] = useState<string[]>([]);

  // State: Modals & Drawers
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'products' | 'supabase'>('products');
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // State: Preferences
  const [wallpaper, setWallpaper] = useState<'midnight' | 'violet' | 'cyan' | 'aurora'>('midnight');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial data loading & ping check
  const refreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [prods, sales, reservations, operational, events, unitCatalog] = await Promise.all([
        supabaseService.getProducts(),
        supabaseService.getSalesMetrics(),
        supabaseService.getReservationMetrics(),
        supabaseService.getOperationalMetrics(),
        supabaseService.getEventLogs(),
        supabaseService.getUnits(),
      ]);

      // Keep Pipou's official destination current in previously saved catalogs.
      setProducts(prods.map(product => {
        if (product.id !== 'pipou') return product;
        return {
          ...product,
          url: PIPOU_PLATFORM_URL,
          ...(product.version === 'v2.0-beta'
            ? { status: product.status === 'Beta' ? 'Ativo' as const : product.status, version: 'v2.0' }
            : {}),
        };
      }));
      setUnits(unitCatalog);
      setSelectedUnitId(current => current === 'all' || unitCatalog.some(unit => unit.id === current) ? current : 'all');
      setSalesData(sales);
      setReservationData(reservations);
      setOperationalData(operational);
      setEventsData(events);

      // Perform background ping test
      await supabaseService.testConnection();
      setSupabaseConfig({ ...supabaseService.config });
    } catch (e) {
      console.warn('Error refreshing metrics:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Global Keyboard Shortcuts (macOS standard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundManager.playClick();
        setSpotlightOpen(prev => !prev);
      } else if (isCmdOrCtrl && e.key === ',') {
        e.preventDefault();
        soundManager.playClick();
        setSettingsTab('supabase');
        setSettingsOpen(true);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        refreshAllData();
      } else if (isCmdOrCtrl && e.key === '1') {
        e.preventDefault();
        setActiveView('launcher');
      } else if (isCmdOrCtrl && e.key === '2') {
        e.preventDefault();
        setActiveView('split');
      } else if (isCmdOrCtrl && e.key === '3') {
        e.preventDefault();
        setActiveView('dashboard');
      } else if (e.key === 'Escape') {
        if (spotlightOpen) setSpotlightOpen(false);
        else if (controlCenterOpen) setControlCenterOpen(false);
        else if (notificationsOpen) setNotificationsOpen(false);
        else if (settingsOpen) setSettingsOpen(false);
        else if (activeProductWindow) setActiveProductWindow(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spotlightOpen, controlCenterOpen, notificationsOpen, settingsOpen, activeProductWindow, refreshAllData]);

  // Window actions
  const handleOpenProduct = (product: ProductApp) => {
    // If it was minimized, remove from minimized
    setMinimizedWindowIds(prev => prev.filter(id => id !== product.id));
    setActiveProductWindow(product);
  };

  const handleMinimizeWindow = () => {
    if (activeProductWindow) {
      if (!minimizedWindowIds.includes(activeProductWindow.id)) {
        setMinimizedWindowIds(prev => [...prev, activeProductWindow.id]);
      }
      setActiveProductWindow(null);
    }
  };

  const handleCloseWindow = () => {
    if (activeProductWindow) {
      setMinimizedWindowIds(prev => prev.filter(id => id !== activeProductWindow.id));
      setActiveProductWindow(null);
    }
  };

  const handleOpenSettings = (tab: 'products' | 'supabase' = 'products') => {
    setSettingsTab(tab);
    setSettingsOpen(true);
  };

  const handleSelectProductById = (id: string) => {
    const found = products.find(p => p.id === id || p.name.toLowerCase().includes(id.toLowerCase()));
    if (found) {
      handleOpenProduct(found);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans select-none">
      {/* 1. Dynamic Liquid Mesh Background & Orbs */}
      <BackgroundOrbs wallpaper={wallpaper} />

      {/* 2. Top Bar (macOS Menu Bar) */}
      <TopBar
        supabaseConfig={supabaseConfig}
        onOpenSettings={handleOpenSettings}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        onToggleControlCenter={() => setControlCenterOpen(prev => !prev)}
        onToggleNotifications={() => setNotificationsOpen(prev => !prev)}
        unreadCount={eventsData.length}
        activeView={activeView}
        onChangeView={setActiveView}
        onRefreshData={refreshAllData}
        isRefreshing={isRefreshing}
      />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 overflow-y-auto z-10 scrollbar-none pb-24">
        {/* VIEW 1: LAUNCHER GRID ONLY */}
        {activeView === 'launcher' && (
          <div className="animate-in fade-in duration-300">
            <AppLauncher
              products={products}
              onSelectProduct={handleOpenProduct}
              onOpenSettings={handleOpenSettings}
            />
          </div>
        )}

        {/* VIEW 2: ANALYTICAL DASHBOARD ONLY */}
        {activeView === 'dashboard' && (
          <div className="animate-in fade-in duration-300">
            <WidgetsPanel
              units={units}
              selectedUnitId={selectedUnitId}
              onSelectUnit={setSelectedUnitId}
              salesData={salesData}
              reservationData={reservationData}
              operationalData={operationalData}
              eventsData={eventsData}
              isLoading={isRefreshing}
              onRefresh={refreshAllData}
              onSelectProductById={handleSelectProductById}
            />
          </div>
        )}

        {/* VIEW 3: SPLIT HYBRID (DESKTOP VISIONOS HUB) */}
        {activeView === 'split' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Top Section: Analytical Telemetry Widgets */}
            <WidgetsPanel
              units={units}
              selectedUnitId={selectedUnitId}
              onSelectUnit={setSelectedUnitId}
              salesData={salesData}
              reservationData={reservationData}
              operationalData={operationalData}
              eventsData={eventsData}
              isLoading={isRefreshing}
              onRefresh={refreshAllData}
              onSelectProductById={handleSelectProductById}
            />

            {/* Bottom Section: SaaS Product Grid */}
            <div className="border-t border-white/10 pt-4">
              <AppLauncher
                products={products}
                onSelectProduct={handleOpenProduct}
                onOpenSettings={handleOpenSettings}
              />
            </div>
          </div>
        )}
      </main>

      {/* 4. Floating Glassmorphic macOS Dock */}
      <Dock
        products={products}
        activeWindowId={activeProductWindow?.id || null}
        minimizedWindowIds={minimizedWindowIds}
        activeView={activeView}
        onChangeView={setActiveView}
        onSelectProduct={handleOpenProduct}
        onOpenSettings={handleOpenSettings}
        onOpenSpotlight={() => setSpotlightOpen(true)}
      />

      {/* 5. Product App Window (Modal with traffic lights) */}
      {activeProductWindow && (
        <AppWindow
          product={activeProductWindow}
          onClose={handleCloseWindow}
          onMinimize={handleMinimizeWindow}
          events={eventsData}
        />
      )}

      {/* 6. macOS Sheet / Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        initialTab={settingsTab}
        onClose={() => setSettingsOpen(false)}
        products={products}
        onSaveProducts={setProducts}
        supabaseConfig={supabaseConfig}
        onSaveSupabaseConfig={setSupabaseConfig}
        onRefreshTelemetry={refreshAllData}
      />

      {/* 7. macOS Spotlight Search (⌘K) */}
      <SpotlightSearch
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        products={products}
        onSelectProduct={handleOpenProduct}
        onOpenSettings={handleOpenSettings}
        onChangeView={setActiveView}
      />

      {/* 8. Control Center Drawer */}
      <ControlCenter
        isOpen={controlCenterOpen}
        onClose={() => setControlCenterOpen(false)}
        wallpaper={wallpaper}
        onChangeWallpaper={setWallpaper}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={handleOpenSettings}
      />

      {/* 9. Notification Center */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        events={eventsData}
        onClearEvents={() => setEventsData([])}
        onSelectProductById={handleSelectProductById}
      />
    </div>
  );
}

export default App;
