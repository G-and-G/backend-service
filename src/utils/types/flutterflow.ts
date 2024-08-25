export interface FlutterFlowResponse {
  event: string;
  data: MobileMoneyData;
  event_type: string;
}

export interface MobileMoneyData {
  id: number;
  tx_ref: string;
  flw_ref: string;
  device_fingerprint: string;
  amount: number;
  currency: string;
  charged_amount: number;
  app_fee: number;
  merchant_fee: number;
  processor_response: string;
  auth_model: string;
  ip: string;
  narration: string;
  status: string;
  payment_type: string;
  created_at: string;
  account_id: number;
  customer: Customer;
}

export interface Customer {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  created_at: string;
}
