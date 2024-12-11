import React, {Component} from 'react';

import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppDispatch, RootState} from '../redux/store';
import {connect} from 'react-redux';
import {addCartItem, onIncrementCount, onDecrementCount} from '../redux/reducers/cartSlice';
import {requestApicall} from '../redux/reducers/cartSlice';
import { IItemObj, IItemObject } from '../../App';

export interface IObject {
  id: number;
  title: string;
  price: string;
  quantity: string;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
  itemCount?: number | undefined;
}

interface IState {
  addCart: boolean;
  getCount: number;
}

interface ICount {
  getCount: number;
  item: IObject;
}

interface IProps {
  addCart: IItemObj[],
  dispatch: AppDispatch
}

let array = [1, 2, 3, 4];

class HomePage extends Component<IProps> {
  state = {
    getStateCartData: [],
    changedText: '',
    addCartCondition: false,
    setCartItemArr: [],
  };

  componentDidMount(): void {
    const {dispatch} = this.props;
    dispatch(requestApicall());
  }

  

  render() {
    const addCartData = this.props.addCart;
   const  onPressCartButton = (product: IItemObj) => {
    // console.log('70',product)
      this.props.dispatch(addCartItem(product));
    };
    const onPressPlusBtn = (item: IItemObj, itemCount: number) => {
       this.props.dispatch(onIncrementCount({item,itemCount}))
    };
    const onPressMinusBtn = (item: IItemObj, itemCount: number) => {
      this.props.dispatch(onDecrementCount({item,itemCount}))
   };

   const ProductItem = ({ productData }: { productData: { products: IItemObj } }) => {
      const product = productData.products;
      const {
        title,
        quantity,
        total,
        discountPercentage,
        discountedTotal,
        thumbnail,
        itemCount,
        cartCondition,
      } = product;
      return (
        <View style={styles.container}>
          <View style={styles.imgStyle}>

            <Image source={{uri: thumbnail}} style={styles.img} />
            <View style={styles.disContainer}>
              <Text style={styles.styleDiscount}> -{discountPercentage}% </Text>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.imgContainer}>
              <Icon name="shopping-bag" style={styles.cartImg} size={20} />
            </View>
            <View style={styles.starContainer}>
              {array.map((item, index) => (
                <View key={index}>
                  <Icon name="star" style={styles.starImg} size={25} />
                </View>
              ))}

              <Icon name="star-half-full" style={styles.starImg} size={25} />
            </View>
            <Text style={styles.titleName} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.items}>
              <Text style={styles.text}>In Stock : </Text>({quantity})
            </Text>
            <Text style={styles.total}>
              <Text style={styles.textTotal}>₹ {Math.round(total)} </Text> ₹{' '}
              {Math.round(discountedTotal)}
            </Text>
            {!cartCondition && (
              <View style={styles.AddCartBtn}>
                <TouchableOpacity
                  style={styles.touchable}
                  onPress={(event) => onPressCartButton(product)}>
                  <Ionicons name="cart" size={25} color="white" />
                  <Text style={styles.AddCartText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
            {cartCondition && (
              <View style={styles.plusMinusContainer}>
                <TouchableOpacity style={styles.plusContainer}>
                  <Icons
                    name="minus"
                    onPress={() => onPressMinusBtn(product, itemCount)}
                    size={20}
                  />
                </TouchableOpacity>

                {itemCount === undefined || itemCount < 0 ? (
                  <Text style={styles.countText}>{itemCount}</Text>
                ) : (
                  <Text style={styles.countText}>{itemCount}</Text>
                )}
                <TouchableOpacity style={styles.plusContainer}>
                  <Icons
                    name="plus"
                    onPress={() => onPressPlusBtn(product, itemCount)}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    };

    return (
      <SafeAreaView>
        <View>
          {/* <View style={styles.searchContainer}>
            <Icon
              name="search"
              style={styles.searchIcon}
              size={25}
              color="#318CE7"
            />
            <TextInput
              inputMode="search"
              cursorColor="black"
              placeholder="Search for Products..."
              placeholderTextColor={'black'}
              value={this.state.changedText}
              style={styles.input}
              onChangeText={text =>
                this.setState({changedText: text})
              }></TextInput>
          </View> */}
          {addCartData.length > 0 ? (
            <FlatList
              data={addCartData}
              numColumns={2}
              renderItem={({ item }) => <ProductItem productData={{ products: item }} />}
              keyExtractor={item => item.id.toString()}
            />
          ) : (
            <View>
              <Text style={styles.notFound}>No Products Found...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  addCart: state.cartData,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  ...dispatch,
  dispatch,
});


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: '',
    margin: -5,
    marginTop: -25,
    borderRadius: 15,
    padding: 10,
    paddingBottom: 20,
    // borderWidth: 2,
  },

  img: {
    height: 100,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  imgStyle: {
    width: '100%',
    height: 200,
    padding: 0,

    marginTop: 40,
  },
  titleName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  price: {
    fontSize: 15,
    marginTop: 6,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: 'bold',
    color: 'green',
  },
  discount: {
    fontSize: 15,
    marginTop: 6,
    fontWeight: 'bold',
  },
  payable: {
    fontSize: 15,
    marginTop: 6,
    fontWeight: 'bold',
  },
  items: {
    fontSize: 15,
    marginTop: 6,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#ffffff',
    padding: 10,
    width: '100%',
    borderBottomLeftRadius: 10,
    paddingTop: 30,
    borderBottomRightRadius: 10,
  },
  proceed: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0dcaf0',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    position: 'absolute',
    top: '90%',
    right: '25%',
    fontWeight: 'bold',
  },
  text: {
    color: 'grey',
    borderWidth: 1,
    borderColor: 'black',
    width: '40%',
  },
  textTotal: {
    color: 'grey',
    borderWidth: 1,
    borderColor: 'black',
    width: '40%',
    textDecorationLine: 'line-through',
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    position: 'absolute',
    top: -20,
    right: 0,
    color: '#ffffff',
    backgroundColor: 'red',
    borderRadius: 50,
  },
  starContainer: {
    flexDirection: 'row',
    height: 30,
    width: 30,
    marginTop: 0,
    marginBottom: 8,
  },

  starImg: {
    width: '90%',
    color: Platform.OS === 'android' ? 'gold' : 'gold',
  },
  styleDiscount: {
    fontWeight: 'bold',
    fontSize: 12,
    paddingLeft: 3,
    padding: 0,
    color: 'white',
  },
  disContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'red',
    width: 60,
    height: 35,
    position: 'absolute',
    zIndex: 1000,
    top: 10,
    left: 10,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: -5,
    right: 10,
  },
  cartImg: {
    color: 'white',
  },

  crossed: {
    fontSize: 25,
    color: 'darkgrey',
    position: 'absolute',
    zIndex: 1000,
    left: 170,
    bottom: 0,
    top: 10,
  },
  input: {
    width: '90%',
    height: 40,
    borderRadius: 12,
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 7,
    marginTop: 20,
    marginBottom: 5,
    borderWidth: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 15,
    borderColor: '#318CE7',
  },
  button: {
    backgroundColor: 'green',
    width: 70,
    height: 30,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderRadius: 12,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  notFound: {
    padding: 12,
    color: 'black',
    fontSize: 16,
  },
  AddCartBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderWidth: 0.1,
    marginTop: 20,
    // width: '60%',
    // width: '90%',
    padding: 6,
    borderRadius: 20,
  },
  AddCartText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 700,
    marginLeft: 6,
  },

  touchable: {
    flexDirection: 'row',
  },
  plusMinusContainer: {
    marginTop: 20,
    // borderWidth: 1,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});




