export interface OperationalUnit {
  id: string;
  name: string;
}

// Minimal catalog verified against public.units on 2026-11-19.
// Keep unit names available when the authenticated API cannot be reached.
// No addresses, contacts, tax identifiers or employee data are bundled.
export const VERIFIED_UNITS: OperationalUnit[] = [
  { id: '14a59758-acbd-479f-9611-25bcac723555', name: 'AI1' },
  { id: '506e6256-e621-49a4-ab65-0c547eb584a2', name: 'Duplex' },
  { id: 'f2a6c9f8-929f-447b-9f77-edd8dad19bd0', name: 'Frêneze' },
  { id: '00000000-0000-0000-0000-000000000010', name: 'HOS' },
  { id: 'a6eba692-e77a-46a6-ab23-b4239892fef2', name: 'KPH Holding e Participações' },
  { id: 'f9c6c7fc-2ecc-4f79-98ce-c3118b670182', name: 'Madonna SP Itaim' },
  { id: '970db6d9-9ff9-4284-9f76-9fbeb494ea04', name: 'Match Point' },
  { id: '674eac8c-5a38-4a42-aa60-0a666387909b', name: 'Meet & Eat' },
  { id: 'a3d0d2d7-0faf-4d52-9c04-ac8d1bb78c2f', name: 'Rezende Gastronomia e Eventos' },
  { id: 'df736329-518a-494e-b6f9-44a3b2921197', name: 'TEEM Group' },
];
