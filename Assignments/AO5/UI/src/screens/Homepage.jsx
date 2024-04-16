import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import candy from  '../../assets/candy.jpg'
import {Card} from '../components'
import { ActivityIndicator } from 'react-native';

const Homepage = ({loggedIn}) => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [candiesData, setCandiesData] = useState([]); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (loadMore = false) => {
    if (searchText && loggedIn){
      try{
          setLoading(true); 
          const nextPage = loadMore ? page + 1 : 1;
          const resp = await fetch(`http://143.244.178.214:8084/candies?search_query=${searchText}&page=${nextPage}&page_size=4`, {
            method: 'POST',
          });

          const data = await resp.json();

          if (data.success) {
            setCandiesData(loadMore ? [...candiesData, ...data.user_data] : data.user_data);
            setPage(nextPage);
          }
          setRespMsg(data.message)
    
      } catch(error) {
        console.error('Error fetching candies:', error);
      } finally {
        setLoading(false); 
      }
    }
    else {
      setCandiesData([])
      setPage(1)
      setLoading(false)
      setSearchText('')
    }
  };

  // call to load more items
  const handleScroll = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      if (loading) return;
      setLoading(true);
      handleSearch(true);
    }
  };

  // determine how much close to bottom
  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const LoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  useEffect(() => {
    setPage(1) // Reset page to 1 when search text changes
    setCandiesData([]) // Reset candiesData to an empty array when search text changes
    setLoading(false)
  }, [searchText]);

  useEffect(() => {
    setPage(1)
    setCandiesData([])
    setLoading(false)
    setSearchText('')
  }, [loggedIn]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={candy} style={styles.image} />
          </TouchableOpacity>

          {
            (loggedIn)?
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  onChangeText={setSearchText}
                  value={searchText}
                  onSubmitEditing={() => handleSearch(false)}
                />
                <TouchableOpacity style={styles.searchIcon} onPress={() => handleSearch(false)}>
                  <Icon name="search" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            : 
              null
          }

          <TouchableOpacity style={styles.iconButton} onPress={handleProfile}>
            <Icon name="person" size={30} color="#000" />
          </TouchableOpacity> 
        </View>

        <View>
          <Text>{!loggedIn? `Welcome, Guest `: ''}</Text>
        </View> 

        {
          (loggedIn)?
            <ScrollView onScroll={handleScroll}>
              <View style={styles.candiesCont}>
                { 
                  (candiesData).map((item) => 
                    <Card  
                      key={item.id} 
                      prodUrl = {item.prod_url} 
                      name = {item.name}  
                      price ={item.price} 
                      desc ={item.desc} 
                      imgUrl = {item.img_url}
                    />
                  )
                }
                {loading && <LoadingIndicator />}
              </View>
            </ScrollView> 
          : 
            null
        }
    </View>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  topContainer: {
    position: 'absolute',
    top: 0, 
    backgroundColor: '#E5E4E2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:'100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    padding: 20,
    borderRadius:'6px',
    zIndex:999
  },

  iconButton: {
    marginHorizontal: 20,
  },
  
  image: {
    width: 38, 
    height: 40,
    borderRadius: 25, 
  },

 searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
    border: "none",
    outline: "none",
    backgroundColor: '#FAF9F6',
  },

  candiesCont:{
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'column',
    marginTop:90,
  },


  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 15,
    color:'rgb(0,0,0)'
  },

  searchIcon: {
    padding: 10,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, 
  },
});

export default Homepage