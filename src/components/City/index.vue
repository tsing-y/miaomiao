<template>
  <div class="city_body">
    <div class="city_list"
         ref='city_list'>
      <div class="city_hot">
        <h2>热门城市</h2>
        <ul class="clearfix">
          <li v-for="item in hotCityList"
              :key="item.id"
              @touchstart='handToCity(item.name,item.id)'>{{item.name}}</li>
        </ul>
      </div>
      <div class="city_sort"
           ref='city_sort'>
        <div v-for="item in cityList"
             :key="item.initial">
          <h2>{{item.initial}}</h2>
          <ul>
            <li v-for="child in item.items"
                :key="child.id"
                @touchstart='handToCity(child.name,child.id)'>{{child.name}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="city_index">
      <ul>
        <li v-for="(item,index) in cityList"
            :key="item.initial"
            @touchstart='handToIndex(index)'>{{item.initial}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'City',
  data () {
    return {
      cityList: [],
      hotCityList: []
    }
  },
  mounted () {
    this.getCityList()
  },
  methods: {
    async getCityList () {
      const cityList = window.localStorage.getItem('cityList')
      const hotCityList = window.localStorage.getItem('hotCityList')
      if (cityList && hotCityList) {
        this.cityList = JSON.parse(cityList)
        this.hotCityList = JSON.parse(hotCityList)
      } else {
        const { status, data } = await this.axios.get('/api/cityList')
        if ((status === 200) && (data.msg === 'ok')) {
          this.formatCityList(data.data.cities)
          window.localStorage.setItem('cityList', JSON.stringify(this.cityList))
          window.localStorage.setItem('hotCityList', JSON.stringify(this.hotCityList))
        }
      }
    },
    formatCityList (cities) {
      for (let i = 0; i < cities.length; i++) {
        const city = cities[i]
        const initial = city.py.substring(0, 1).toUpperCase()
        if (toCompare(this.cityList, initial)) {
          // this.cltyList.find(el => {
          //   if (el.initial === initial) {
          //     el.item.push(city)
          //   }
          //   return
          // })
          for (let j = 0; j < this.cityList.length; j++) {
            if (this.cityList[j].initial === initial) {
              this.cityList[j].items.push({
                name: city.nm,
                id: city.id,
                initial: initial
              })
            }
          }
        } else {
          this.cityList.push({
            initial: initial.toUpperCase(),
            items: [{
              name: city.nm,
              id: city.id,
              initial: initial
            }]
          })
        }
        if (city.isHot === 1) {
          this.hotCityList.push({
            name: city.nm,
            id: city.id
          })
        }
      }
      this.cityList.sort((n1, n2) => {
        if (n1.initial > n2.initial) {
          return 1
        } else if (n1.initial < n2.initial) {
          return -1
        } else {
          return 0
        }
      })
      function toCompare (cityList, initial) {
        for (let i = 0; i < cityList.length; i++) {
          if (cityList[i].initial === initial) {
            return true
          }
        }
        return false
      }
    },
    handToCity (name, id) {
      this.$store.commit('city/CITY_INFO', { name, id })
      window.localStorage.setItem('nowName', name)
      window.localStorage.setItem('nowId', id)
      this.$router.push('/movie/nowPlaying')
    },
    handToIndex (index) {
      const h2 = this.$refs.city_sort.querySelectorAll('h2')
      this.$refs.city_list.scrollTop = h2[index].offsetTop
    }
  },
}
</script>


<style scoped>
#content .city_body {
  margin-top: 45px;
  display: flex;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
}
.city_body .city_list {
  flex: 1;
  overflow: auto;
  background: #fff5f0;
}
.city_body .city_list::-webkit-scrollbar {
  background-color: transparent;
  width: 0;
}
.city_body .city_hot {
  margin-top: 20px;
}
.city_body .city_hot h2 {
  padding-left: 15px;
  line-height: 30px;
  font-size: 14px;
  background: #f0f0f0;
  font-weight: normal;
}
.city_body .city_hot ul li {
  float: left;
  background: #fff;
  width: 29%;
  height: 33px;
  margin-top: 15px;
  margin-left: 3%;
  padding: 0 4px;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  line-height: 33px;
  text-align: center;
  box-sizing: border-box;
}
.city_body .city_sort div {
  margin-top: 20px;
}
.city_body .city_sort h2 {
  padding-left: 15px;
  line-height: 30px;
  font-size: 14px;
  background: #f0f0f0;
  font-weight: normal;
}
.city_body .city_sort ul {
  padding-left: 10px;
  margin-top: 10px;
}
.city_body .city_sort ul li {
  line-height: 30px;
  line-height: 30px;
}
.city_body .city_index {
  width: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  border-left: 1px #e6e6e6 solid;
}
.city_body .city_index ul li {
  margin-bottom: 1px;
}
</style>
