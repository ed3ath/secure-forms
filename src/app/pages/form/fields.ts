export const fields = [
  {
    category: 'Contact Details',
    fields: [
      {
        label: 'Name',
        placement: 'stacked',
        name: 'name',
        type: 'text',
        required: true,
        encrypt: false,
      },
      {
        label: 'Number',
        placement: 'stacked',
        name: 'phoneNo',
        type: 'tel',
        required: true,
        encrypt: false,
      },
      {
        label: 'Email',
        placement: 'stacked',
        name: 'email',
        type: 'email',
        required: true,
        encrypt: false,
      },
    ],
  },
  {
    category: 'Company Details',
    fields: [
      {
        label: 'Company Name',
        placement: 'stacked',
        name: 'companyName',
        type: 'text',
        required: true,
        encrypt: false,
      },
      {
        label: 'Trading As Name',
        placement: 'stacked',
        name: 'tradingAsName',
        type: 'text',
        required: false,
        encrypt: false,
      },
      {
        label: 'Company Registration Number',
        placement: 'stacked',
        name: 'companyRegNo',
        type: 'text',
        required: true,
        encrypt: false,
      },
      {
        label: 'Company VAT Number',
        placement: 'stacked',
        name: 'companyVATNo',
        type: 'text',
        required: false,
        encrypt: false,
      },
      {
        label: 'Company Billing Address',
        placement: 'stacked',
        name: 'companyBillingAddr',
        type: 'text',
        required: true,
        encrypt: false,
      },
      {
        label: 'Group Name',
        placement: 'stacked',
        name: 'groupName',
        type: 'text',
        required: false,
        encrypt: false,
      },
    ],
  },
  {
    category: 'Local IT Support Contact Details',
    fields: [
      {
        label: 'Company/Individual Name',
        placement: 'stacked',
        name: 'supportName',
        type: 'text',
        required: false,
        encrypt: false,
      },
      {
        label: 'Contact Number',
        placement: 'stacked',
        name: 'supportPhoneNo',
        type: 'tel',
        required: false,
        encrypt: false,
      },
    ],
  },
  {
    category: 'Remote Desktop Details',
    fields: [
      {
        label: 'Address',
        placement: 'stacked',
        name: 'remoteAddress',
        type: 'text',
        required: true,
        encrypt: true,
      },
      {
        label: 'Username',
        placement: 'stacked',
        name: 'remoteUsername',
        type: 'text',
        required: true,
        encrypt: true,
      },
      {
        label: 'Password',
        placement: 'stacked',
        name: 'remotePassword',
        type: 'password',
        required: true,
        encrypt: true,
      },
    ],
  },
  {
    category: 'VPN details (If applicable)',
    fields: [
      {
        label: 'Address',
        placement: 'stacked',
        name: 'vpnAddress',
        type: 'text',
        required: false,
        encrypt: true,
      },
      {
        label: 'Username',
        placement: 'stacked',
        name: 'vpnUsername',
        type: 'text',
        required: false,
        encrypt: true,
      },
      {
        label: 'Password',
        placement: 'stacked',
        name: 'vpnPassword',
        type: 'password',
        required: false,
        encrypt: true,
      },
    ],
  },
  {
    category: 'IQ Enterprise Details',
    fields: [
      {
        label: 'Username',
        placement: 'stacked',
        name: 'iQUsername',
        type: 'text',
        required: true,
        encrypt: true,
      },
      {
        label: 'Password',
        placement: 'stacked',
        name: 'iQPassword',
        type: 'password',
        required: true,
        encrypt: true,
      },
      {
        label:
          'Please confirm if the API has been registered on your IQ for the company you are registering for',
        placement: 'stacked',
        name: 'iQConfirm',
        type: 'checkbox',
        required: true,
        encrypt: false,
        default: false,
      },
    ],
  },
];
