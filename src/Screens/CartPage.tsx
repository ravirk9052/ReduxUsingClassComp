import React, {Component} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import Icons from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import {IItemObj, IItemObject} from '../../App';
import {onDecrementCount, onIncrementCount} from '../redux/reducers/cartSlice';
import {AppDispatch, RootState} from '../redux/store';
interface IProps {
  DataInCart: IItemObj[];
  dispatch: AppDispatch;
  navigation: {
    goBack: () => void;
  };
}

interface IPrefiil {
    email:  string;
    contact:  string;
    name:  string;
}

interface ITheme {
  color: string;
}

interface IOptions {
  description: string;
  image:  string;
  currency:  string;
  key:  string;// Your api key
  amount:  string;
  name:  string;
  prefill:  IPrefiil;
  theme: ITheme;
}

interface IData {
  razorpay_payment_id: string;
}

class CartPage extends Component<IProps> {
  render() {
    const DataInCart = this.props.DataInCart;
    // console.log('26', DataInCart);
    const renderAddedCartItem = (Item: IItemObject) => {
      const {item} = Item;
      const {title, quantity, discountPercentage, thumbnail, itemCount} = item;

      const onPressPlusButton = (item: IItemObj, itemCount: number) => {
        this.props.dispatch(onIncrementCount({item, itemCount}));
      };

      const onPressMinusButton = (item: IItemObj, itemCount: number) => {
        this.props.dispatch(onDecrementCount({item, itemCount}));
      };

      return (
        <SafeAreaView>
          {itemCount > 0 && (
            <View style={styles.cartContainer}>
              <View style={styles.imgStyle}>
                <Image source={{uri: thumbnail}} style={styles.img} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.titleText} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.stockText}>
                  In Stock: <Text style={styles.quantity}>({quantity})</Text>
                </Text>
                <View style={styles.plusMinusContaner}>
                  <TouchableOpacity
                    style={styles.plusContainer}
                    onPress={() => onPressMinusButton(item, itemCount)}>
                    <Icons name="minus" size={25} color="#9B9B9B" />
                  </TouchableOpacity>

                  <View>
                    <Text style={styles.itemCount}>{itemCount}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.plusContainer}
                    onPress={() => onPressPlusButton(item, itemCount)}>
                    <Icons name="plus" size={25} color="#9B9B9B" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.dotsContainer}>
                <Icons name="dots-three-vertical" color="grey" size={25} />
                <Text style={styles.price}>
                  {' '}
                  ₹ {discountPercentage * itemCount}
                </Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      );
    };

    const onPressPayBtn = async () => {
      // console.log('81');
      var options:IOptions = {
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_68uMD0pCytYXta', // Your api key
        amount: '5000',
        name: 'Ravi kiran',
        prefill: {
          email: 'void@razorpay.com',
          contact: '9191919191',
          name: 'Razorpay Software',
        },
        theme: {color: '#F37254'},
      };
      const response = await RazorpayCheckout.open(options);
      console.log('128',response)
      if (response.razorpay_payment_id){
        Alert.alert(`Success: ${response.razorpay_payment_id}`);
      } else {
        Alert.alert(`Something went Wrong !!`)
      }
        // .then((data: IData) => {
        //   // handle success
        //   // console.log('101', data);
        //   Alert.alert(`Success: ${data.razorpay_payment_id}`);
        // })
        // .catch((error: {code: string, description: string}) => {
        //   // handle failure
        //   Alert.alert(`Error: ${error.code} | ${error.description}`);
        // });
    };

    return (
      <SafeAreaView>
        <View style={styles.bagContainer}>
          <Text style={styles.bagText}>My Bag</Text>
        </View>

      {DataInCart.length > 0 ? (
        <View>
   <FlatList
   data={DataInCart}
   renderItem={renderAddedCartItem}
   keyExtractor={item => item.id.toString()}
 />
 <View style={styles.payContainer}>
   <TouchableOpacity style={styles.payNowBtn} onPress={onPressPayBtn}>
     <Text style={styles.payText}>Pay Now</Text>
   </TouchableOpacity>
 </View></View>
      ) :(
        <View style={styles.emptyContainer}>
          <Text>Cart is Empty...</Text>
          <TouchableOpacity style={styles.goTo}
           onPress={() => this.props.navigation.goBack()}
          // onPress={() => console.log('this',this.props.navigation)}
           >
          <Text>Go To Home</Text>
          </TouchableOpacity>
       
          </View>
      )
      }
     
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  DataInCart: state.DataInCart,
  cartData: state.cartData,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  ...dispatch,
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);

const styles = StyleSheet.create({
  cartContainer: {
    // borderWidth: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    margin: 10,
    // padding: 8,
    // marginLeft: 10,
    marginTop: 10,
  },
  textContainer: {
    // borderWidth: 1,
    width: '45%',
    // borderWidth: 1,
    marginLeft: 15,
    padding: 3,
  },
  img: {
    height: '100%',
  },
  imgStyle: {
    width: '30%',
    height: 100,
    padding: 0,
    borderTopLeftRadius: 12,
  },
  titleText: {
    // flex: 1,
    paddingLeft: 5,
    fontSize: 16,
    fontWeight: 700,
    color: '#222222',
    width: '100%',
  },
  stockText: {
    paddingLeft: 5,
    fontSize: 14,
    color: 'grey',
  },
  quantity: {
    fontWeight: 700,
    fontSize: 15,
    color: '#222222',
  },
  plusContainer: {
    // width: 25,
    // height: 25,
    padding: 5,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    shadowOpacity: 0.2,
    shadowOffset: {width: 2, height: 2},
    elevation: 10,
  },
  plusMinusContaner: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // justifyContent: 'flex-start',
    // borderWidth: 1,
  },
  itemCount: {
    fontSize: 16,
    fontWeight: 700,
  },
  dotsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginRight: 10,
    // borderWidth: 1,
  },
  price: {
    color: '#222222',
    fontSize: 16,
    fontWeight: 700,
  },
  bagContainer: {
    marginLeft: 10,
    // borderWidth: 1,
    marginTop: 50,
  },
  bagText: {
    color: '#222222',
    fontSize: 34,
    fontWeight: 'bold',
  },
  payNowBtn: {
    borderWidth:0.1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'orange',
    width: '90%',
    borderRadius: 15,
    marginTop: '65%',
  },
  payContainer: {
    // flex: 1,
    // borderWidth: 1,
   
    justifyContent: 'center',
    alignItems: 'center',
  },
  payText: {
    fontSize: 22,
    fontWeight: 700,
  },
  emptyContainer: {
    // flex: 1,
    // borderWidth: 1,
    // flex: 1,
    marginTop: '65%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goTo: {
    margin: 12,
    backgroundColor: 'lightgreen',
    padding: 12,
    borderRadius: 12,
  }
});
