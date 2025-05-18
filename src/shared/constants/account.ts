import {
    UserProfile,
    UserAddress,
    UserCredit,
    ShoppingPreference,
    FavoriteBrand,
    CommunicationPreference,
    LanguageOption
} from '@shared/types/user';

export const ACCOUNT_NAVIGATION = [
    { path: '/account/orders', label: 'Orders and returns' },
    { path: '/account/credits', label: 'Credits and Refunds' },
    { path: '/account/details', label: 'Details and security' },
    { path: '/account/addresses', label: 'Address book' },
    { path: '/account/shopping-preferences', label: 'Shopping preferences' },
    { path: '/account/communication-preferences', label: 'Communication preferences' },
    { path: '/account/referral', label: 'Refer a friend' },
    { path: '/account/services', label: 'Connected services' },
];

export const MOCK_USER_PROFILE: UserProfile = {
    id: 'user-123',
    firstName: 'PUSHPARAJ',
    lastName: 'MEHTA',
    email: 'hmehta588@rku.ac.in',
    gender: 'Unspecified',
    phone: '',
    dateOfBirth: '',
};

export const MOCK_USER_ADDRESSES: UserAddress[] = [];

export const MOCK_USER_CREDIT: UserCredit = {
    availableCredit: 0,
    availableRefunds: 0,
    pendingCredit: 0,
    totalCredit: 0,
};

export const SHOPPING_DEPARTMENTS: ShoppingPreference[] = [
    { department: 'Womenswear', isSelected: true },
    { department: 'Menswear', isSelected: false },
    { department: 'Kidswear', isSelected: false },
];

export const FAVORITE_BRANDS: FavoriteBrand[] = [
    { id: 'brand-1', name: 'BIRGITTE HERSKIND', isSelected: false },
    { id: 'brand-2', name: 'Germanier', isSelected: false },
    { id: 'brand-3', name: 'IVY OAK', isSelected: false },
    { id: 'brand-4', name: 'RASSVET', isSelected: false },
    { id: 'brand-5', name: '*S Max Mara', isSelected: false },
    { id: 'brand-6', name: '*BABY MILO® STORE BY *A BATHING APE®', isSelected: false },
    { id: 'brand-7', name: '032c', isSelected: false },
    { id: 'brand-8', name: '0711', isSelected: false },
    { id: 'brand-9', name: '10 CORSO COMO', isSelected: false },
    { id: 'brand-10', name: '100% Eyewear', isSelected: false },
];

export const COMMUNICATION_PREFERENCES: CommunicationPreference[] = [
    {
        id: 'pref-1',
        type: 'style_updates',
        title: 'Style updates',
        description: 'Stay up to date with our edit of the best new arrivals, brands, boutiques and trends',
        isSelected: true,
    },
    {
        id: 'pref-2',
        type: 'exclusive_invitations',
        title: 'Exclusive invitations and offers',
        description: 'Hear about our free delivery days, exclusive sale previews and special promotions',
        isSelected: true,
    },
    {
        id: 'pref-3',
        type: 'editorial_roundup',
        title: 'Editorial roundup',
        description: 'Get the FARFETCH view on the latest news, boutique edits, cultural insights and our take on the brands and trends that count',
        isSelected: true,
    },
    {
        id: 'pref-4',
        type: 'stock_alerts',
        title: 'Stock alerts',
        description: 'Get stock updates on your favourite items',
        isSelected: true,
    },
];

export const LANGUAGE_OPTIONS: LanguageOption[] = [
    { id: 'lang-1', name: 'English (American)', code: 'en-US' },
    { id: 'lang-2', name: 'English (British)', code: 'en-GB' },
    { id: 'lang-3', name: 'French', code: 'fr-FR' },
    { id: 'lang-4', name: 'Spanish', code: 'es-ES' },
    { id: 'lang-5', name: 'German', code: 'de-DE' },
    { id: 'lang-6', name: 'Italian', code: 'it-IT' },
    { id: 'lang-7', name: 'Chinese', code: 'zh-CN' },
    { id: 'lang-8', name: 'Korean', code: 'ko-KR' },
    { id: 'lang-9', name: 'Japanese', code: 'ja-JP' },
]; 