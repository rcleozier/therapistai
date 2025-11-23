# FriendConnect

A simple and focused friend management app built with React Native and Expo.

## Features

### 👥 Friends Management
- Add and organize friends
- Track contact history and frequency
- Set relationship types (Friend, Family, Colleague, etc.)
- Mark favorites
- Add notes and contact information
- Search and filter friends
- Contact urgency tracking (overdue, due soon, on track)
- Contact logging with different methods (call, text, email, in-person, video)
- Visual indicators for contact status

## Tech Stack

- **Frontend**: React Native
- **Framework**: Expo
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons
- **Charts**: React Native Chart Kit
- **Date Handling**: Moment.js
- **Responsive Design**: React Native Responsive Screen

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd friendconnect
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Start the development server:
```bash
yarn start
# or
npm start
```

4. Run on your preferred platform:
```bash
# iOS
yarn ios

# Android
yarn android

# Web
yarn web
```

## Project Structure

```
friendconnect/
├── assets/           # Images, icons, and splash screens
├── components/       # Reusable UI components
├── constants/        # Colors, fonts, and spacing
├── screens/          # Main app screens
├── utils/            # Utility functions and helpers
├── App.js           # Main app component
├── app.json         # Expo configuration
└── package.json     # Dependencies and scripts
```

## Key Screens

- **FriendsScreen**: Complete friend management and contact tracking interface

## Data Storage

The app uses AsyncStorage to persist data locally on the device:
- Friends list and contact information
- Contact logs and history
- User preferences and settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Note**: This app was transformed from a drink tracking app to a focused friend management solution. The app now provides a single, comprehensive interface for managing friends and tracking contact frequency. 