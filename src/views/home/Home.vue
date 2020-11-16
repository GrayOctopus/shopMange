<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="~assets/heima.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <!--页面主体-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <!--侧边栏菜单区-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapsed"
            :collapse-transition="false"
            :router="true" :default-active="activePath">
          <!--一级菜单-->
          <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
            <!--一级菜单模板-->
            <template slot="title">
              <!--图标-->
              <i :class="iconList[index]"></i>
              <!-- 文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id" @click="saveNacState('/'+subItem.path)">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import {getMenuList} from "network/login";

export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      iconList: [
        'iconfont icon-user',
        'iconfont icon-tijikongjian',
        'iconfont icon-shangpin',
        'iconfont icon-danju',
        'iconfont icon-baobiao'],
      isCollapsed: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logOut() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    //获得左边菜单的数据
    getMenuList() {
      getMenuList().then( res => {
        this.menuList = res.data
        // console.log(res.data);
      })
    },
    //伸缩左侧菜单
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
    //将被激活的菜单保存到sessionStorage中
    saveNacState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.el-header > div {
  display: flex;
  align-items: center;
}

.el-header > div span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
}

.el-aside .el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>