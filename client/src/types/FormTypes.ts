export interface IRequestForm {
    phoneNumber: string;
    fullName: string;
    email: string;
    applicationType: 'Sale' | 'Purchase' | 'Auction';
  }