
import { NavigationProp } from '@react-navigation/native';

export class ProfileRouter {
  constructor(private navigation: NavigationProp<any>) {}

  navigateToSupport() {
    this.navigation.navigate('Support');
  }

  navigateToHistory() {
    // In case history navigation is needed
    this.navigation.navigate('History');
  }

  goBack() {
    this.navigation.goBack();
  }
}
