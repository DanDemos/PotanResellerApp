
import { NavigationProp } from '@react-navigation/native';

export class ChatRouter {
  constructor(private navigation: NavigationProp<any>) {}

  goBack() {
    this.navigation.goBack();
  }

  navigateToHome() {
    this.navigation.navigate('Home');
  }
}
