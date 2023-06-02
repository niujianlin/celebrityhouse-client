<template>
  <header class="header">
    <div class="header-title">
      <a href="#/homeBoard">
        <span style="color: rgb(90, 133, 25)">C</span>
        <span style="color: rgb(90, 133, 25)">e</span>
        <span style="color: rgb(90, 133, 25)">l</span>
        <span style="color: rgb(90, 133, 25)">e</span>
        <span style="color: rgb(90, 133, 25)">h</span>
        <span style="color: rgb(90, 133, 25)">o</span>
        <span style="color: rgb(90, 133, 25)">u</span>
        <span style="color: rgb(90, 133, 25)">s</span>
        <span style="color: rgb(90, 133, 25)">e</span>
      </a>
    </div>
    <div class="header-nav">
      <ul>
        <li v-for="category in cate" :key="cate._id">
          <a @click="searchByCategory(category._id)">{{ category.name }}</a>
        </li>
      </ul>
    </div>

    <div class="header-user">
      <n-button type="info"> 发帖 </n-button>
      <n-button type="info"> 搜索 </n-button>
      <n-button type="info"> 登录 </n-button>
    </div>
  </header>
  <div class="mainbody">
    <n-space class="search">
      <n-input
        v-model:value="pageInfo.keyword"
        :style="{ width: '500px' }"
        placeholder="请输入关键字"
      />
      <n-button type="primary" ghost @click="loadBlogs()"> 搜索 </n-button>
    </n-space>

    <div
      v-for="(blog, index) in blogListInfo"
      style="margin-bottom: 15px; cursor: pointer"
    >
      <n-card :title="blog.title" @click="toDetail(blog)">
        {{ blog.content }}

        <template #footer>
          <n-space align="center">
            <div>发布时间：{{ blog.createtime }}</div>
          </n-space>
        </template>
      </n-card>
    </div>
    <n-pagination
      @update:page="loadBlogs"
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
    />

    <n-divider />
  </div>

  <div class="footer">
    <div>Power by niujl</div>
    <div>XICP备XXXXX号-1</div>
  </div>
</template>
  
  <script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";
const router = useRouter();
const route = useRoute();

const message = inject("message");
const dialog = inject("dialog");
const axios = inject("axios");

const cate = ref([]);

// 选中的分类
const selectedCategory = ref(0);
// 分类选项
const categortyOptions = ref([]);
// 文章列表
const blogListInfo = ref([]);

// 查询和分页数据
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
  keyword: "",
  categoryid: 0,
});

onMounted(() => {
  loadCategorys();
  loadBlogs();
});

// 读取分类信息
const loadCategorys = async () => {
  let res = await axios.get("/category/list");
  cate.value = res.data.categorys;
  console.log(res);
};

/**
 * 获取博客列表
 */
const loadBlogs = async (page = 1) => {
  // 当点击后一页的时候，组件会传递值给page，因此首次是第一页，后面都是传递的page值
  // if (page != 1) {
  //     pageInfo.page = page;
  // }else{
  //     pageInfo.page = 1;
  // }
  pageInfo.page = page;

  let res = await axios.get(
    `/artical/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryid=${pageInfo.categoryid}`
  );
  let temp_rows = res.data.data.articals2.records;
  console.log("进来到这了");
  console.log("看看temp_rows", temp_rows);
  // 处理获取的文章列表数据
  for (let row of temp_rows) {
    row.content = row.content.substr(0, 20);
    row.content += "...";
    // 把时间戳转换为年月日
    let d = new Date(row.createtime);
    row.createtime = `${d.getFullYear()}年${
      d.getMonth() + 1
    }月${d.getDate()}日`;
  }
  blogListInfo.value = temp_rows;
  pageInfo.count = res.data.data.articals2.total; // 所有博客条数
  //计算分页大小
  pageInfo.pageCount =
    parseInt(pageInfo.count / pageInfo.pageSize) +
    (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0);
  console.log(res);
};

/**
 * 选中分类
 */
const searchByCategory = (categoryid) => {
  pageInfo.categoryid = categoryid;
  loadBlogs();
};

// 查看帖子,页面跳转
const toDetail = (blog) => {
  router.push({ path: "/detail", query: { id: blog._id } });
};
</script>
  
  <style scoped>
a {
  text-decoration: none;
  list-style: none;
  cursor: pointer;
}
li {
  list-style: none;
}
.header {
  width: 100vw;
  height: 65px;
  display: grid;
  grid-template-areas: "title nav  user";
  padding: 0 40px;
  grid-template-columns: 2fr 3fr 1fr 1fr auto;
  align-items: center;
  z-index: 200;
  background-color: #fff;
  background-position: center; /* 将图片在容器中居中对齐 */
}

.header-logo {
  grid-area: logo;
  font-size: 24px;
  font-weight: bold;
}

.header-title {
  grid-area: title;
  padding-left: 20px;
  font-size: large;
  color: aliceblue;
}
.header-title p {
  font-size: 25px;
  font-weight: 700;
}
.header-nav {
  grid-area: nav;
  /* flex: 1; */
  display: flex;
  height: 100%;
}
.header-nav ul li {
  display: inline-block;
  padding: 10px;
}

.search {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: 8px 12px;
  padding-bottom: 10px;
}

.mainbody {
  padding: 20px 200px;
}

.footer {
  text-align: center;
}
</style>