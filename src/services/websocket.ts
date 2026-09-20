import { useStore } from '../store/useStore';

class TelemetryWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/telemetry';
  private reconnectInterval: number = 3000;
  private isConnected: boolean = false;

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      console.log(`[UrbanEye Telemetry WS] Connecting to ${this.url}...`);
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[UrbanEye Telemetry WS] Connected to Central Ingest Server');
        this.isConnected = true;
        useStore.getState().setServerConnected(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'TELEMETRY_EVENT') {
            useStore.getState().handleLiveTelemetryEvent(payload.data);
          } else if (payload.type === 'CONNECTED' && payload.recent_events) {
            payload.recent_events.forEach((evt: any) => {
              useStore.getState().handleLiveTelemetryEvent(evt);
            });
          }
        } catch (err) {
          console.error('[UrbanEye Telemetry WS] Error parsing websocket payload:', err);
        }
      };

      this.ws.onclose = () => {
        console.warn(`[UrbanEye Telemetry WS] Disconnected. Reconnecting in ${this.reconnectInterval / 1000}s...`);
        this.isConnected = false;
        useStore.getState().setServerConnected(false);
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = (err) => {
        console.error('[UrbanEye Telemetry WS] Socket error:', err);
        this.ws?.close();
      };
    } catch (e) {
      console.error('[UrbanEye Telemetry WS] Failed to initiate WebSocket connection:', e);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const telemetryWS = new TelemetryWebSocketClient();
