import React from 'react';
import { SafeAreaView} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import HomePage from './src/Screens/HomePage';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CartPage from './src/Screens/CartPage';
import CustomBottomTab from './src/Screens/CustomBottomTab';

const Tab = createBottomTabNavigator();
export interface IItemObj {
  discountPercentage: number;
  discountedTotal: number;
  id: number;
  itemCount: number;
  price: number;
  quantity: number;
  thumbnail: string;
  title: string;
  total: number;
  cartCondition: boolean;
  // length: number;
}

export interface IItemObject {
  item: {
    discountPercentage: number;
    discountedTotal: number;
    id: number;
    itemCount: number;
    price: number;
    quantity: number;
    thumbnail: string;
    title: string;
    total: number;
    cartCondition: boolean;
  };
}


const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <SafeAreaView style={{flex: 1}}>
          <Tab.Navigator screenOptions={{headerShown: false}} tabBar={props => <CustomBottomTab {...props} />}>
            <Tab.Screen name="HomePage" component={HomePage} />
            <Tab.Screen name="CartPage" component={CartPage} />
          </Tab.Navigator>
        </SafeAreaView>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
