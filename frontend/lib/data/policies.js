export const policies = [
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    icon: 'XCircle',
    rules: [
      'Cancellation done 24 hours before departure: 75% refund',
      'Cancellation done 12-24 hours before departure: 50% refund',
      'Cancellation done 6-12 hours before departure: 25% refund',
      'Cancellation done less than 6 hours before departure: No refund',
    ],
  },
  {
    id: 'reschedule',
    title: 'Reschedule Policy',
    icon: 'RefreshCw',
    rules: [
      'Rescheduling allowed up to 12 hours before departure',
      'One free rescheduling per booking',
      'Additional rescheduling will incur 10% fare difference charge',
      'Subject to seat availability',
    ],
  },
  {
    id: 'boarding',
    title: 'Boarding Rules',
    icon: 'Clock',
    rules: [
      'Board 15 minutes before departure',
      'Carry valid ID proof (Aadhaar/PAN/Voter ID/Passport)',
      'Show booking confirmation at boarding point',
      'Luggage allowed: 1 cabin bag (max 7kg) + 1 check-in bag (max 15kg)',
    ],
  },
];