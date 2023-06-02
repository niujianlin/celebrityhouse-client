<template>
  <div class="container">
    <n-button @click="back">返回</n-button>

    <!-- 标题 -->
    <n-h1>{{ blogInfo.title }}</n-h1>
    <!-- 文章内容 -->
    <div class="blog-content">
      <div v-html="blogInfo.content"></div>
    </div>
    <!-- 评论 -->
    <n-divider />
    <div class="comments">
      <div class="wricomm-header">
        <n-avatar
          class="input-avatar"
          round
          size="medium"
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        />
        <textarea
          v-model="writeComment"
          class="input"
          type="textarea"
          placeholder="自动调整尺寸"
        />
        <label for="file">上传图片</label>
        <input
          type="file"
          id="file1"
          name="cover"
          ref="file"
          @change="onFileChange"
        />
        <img
          class="preuploadpic"
          src=""
          ref="preview"
          style="margin-left: 50px"
        />
        <!-- <n-upload
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
          :default-file-list="fileList"
          list-type="image-card"
        >
          点击上传
        </n-upload> -->
        <!-- <n-upload
          action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
          @before-upload="beforeUpload"
        >
          <n-button>上传 PNG 文件</n-button>
        </n-upload> -->

        <n-button class="sub" type="info" @click="subComment"> 发布 </n-button>
      </div>
      <div class="showcomments">
        <div
          v-for="comment in fatherComment"
          :key="comment._id"
          class="comments-item"
        >
          <n-divider />
          <span class="name" style="display: block">{{
            comment.uid.account
          }}</span>
          <span class="content" style="display: block">{{
            comment.content
          }}</span>
          <img
            class="picture"
            :src="comment.imgpath"
            style="max-height: 500px; display: block"
          />
          <span class="time" style="display: inline-block">{{
            comment.time
          }}</span>
          <span
            style="display: inline-block; padding-left: 10px; cursor: pointer"
            >回复</span
          >
          <div v-if="comment.isshow == 1">
            <a
              @click="showchildren(comment._id)"
              style="font-size: small; cursor: pointer"
              >展开评论</a
            >
          </div>
          <div
            class="commentdetail"
            v-if="isshowdetail[comment._id]"
            v-for="son in sonComment"
            :key="son._id"
          >
            <span class="name" style="display: block">{{
              son.uid.account
            }}</span>
            <span class="content" style="display: block">{{
              son.content
            }}</span>
            <span class="time" style="display: inline-block">{{
              son.time
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { AdminStore } from "../stores/AdminStore";
const adminStore = AdminStore();

const axios = inject("axios");

const router = useRouter();
const route = useRoute();
const blogInfo = ref({});
const fatherComment = ref([]);
const fatherHasSon = ref([]);
const sonComment = ref([]);
// let isshowdetail = ref({});
let isshowdetail = reactive({});
// let isshowdetail = {};
let showSonComment = ref([]);
let tempfather = [];
let tempson = [];
let tempfatherhasson = new Set();

//
const writeComment = ref();

onMounted(() => {
  loadBlog();
  loadComment();
});

/**
 * 读取文章详情
 */
const loadBlog = async () => {
  let res = await axios.get("/artical/detail?id=" + route.query.id);
  blogInfo.value = res.data.article;
};

// 读取评论详情
const loadComment = async () => {
  let res = await axios.get("/comment/artical?id=" + route.query.id);
  console.log("评论内容：", res);
  tempfather = res.data.data.filter((item) => item.isparent === 0);
  tempfather.forEach((item) => {
    if (
      item.imgpath !== "" &&
      item.imgpath !== undefined &&
      item.imgpath !== null
    ) {
      item.imgpath = server_url + item.imgpath;
    }
  });
  console.log("tempfather = ", tempfather);
  tempson = res.data.data.filter((item) => item.isparent === 1);
  console.log("sonComment=", sonComment);

  for (let i = 0; i < tempson.length; i++) {
    for (let j = 0; j < tempfather.length; j++) {
      if (tempson[i].parentid === tempfather[j]._id) {
        tempfather[j]["isshow"] = 1;
        tempfatherhasson.add(tempfather[j]);
        // 有可能有问题
        isshowdetail[tempfather[j]._id] = false;
        console.log(
          "isshowdetail[tempfather[j]._id] = ",
          isshowdetail[tempfather[j]._id]
        );
        console.log("isshowdetail = ", isshowdetail);
      }
    }
  }
  fatherComment.value = tempfather;
  //   sonComment.value = tempson;

  console.log("tempfatherhasson = ", tempfatherhasson);
  fatherHasSon.value = tempfatherhasson;
  console.log("fatherHasSon = ", fatherHasSon);
};

// 展开评论
const server_url = inject("server_url");

let showchild = [];
const showchildren = (id) => {
  showchild = [];
  // 关掉其他子评论
  let arr = Object.keys(isshowdetail);
  for (let i = 0; i < arr.length; i++) {
    console.log("Object.keys(isshowdetail) = ", arr);
    if (id != arr[i]) {
      isshowdetail[arr[i]] = false;
    }
  }
  // 显示当前评论的子评论
  for (let i = 0; i < tempson.length; i++) {
    console.log("tempSon = ", tempson);
    if (tempson[i].parentid == id) {
      showchild.push(tempson[i]);
    }
  }
  console.log("showchild =", showchild);
  // 双向绑定当前的评论
  sonComment.value = showchild;
  isshowdetail[id] = !isshowdetail[id];
  console.log("isshowdetail[id] = ", isshowdetail[id]);
};

// 上传+读取图片
const preview = ref(null);
let fileopt;
const onFileChange = (e) => {
  let reader = new FileReader();
  fileopt = e.target.files[0];
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function () {
    console.log("reader.result = ", reader.result);
    preview.value.src = reader.result;
    const formData = new FormData();
  };
};

//提交评论
let url = "";
const subComment = async () => {
  if (adminStore.userid == null) {
    console.log("请登录");
    alert("请登录");
    router.push("/login");
    return;
  } else {
    if (fileopt != null) {
      console.log("评论有图片");
      const formData = new FormData();
      formData.append("image", fileopt);

      const res = await axios.post("/upload/comment_pic_upload", formData);

      console.log("图片res(url) = ", res.data.data.url);
      url = res.data.data.url;
    }

    console.log("adminStore.userid = ", adminStore.userid);
    console.log("adminStore = ", adminStore);

    const response = await axios.post("/comment/add", {
      aid: route.query.id,
      uid: adminStore.userid,
      content: writeComment.value,
      isparent: 0,
      parentid: "",
      imgpath: url,
    });

    console.log("添加评论的response = ", response);
  }
};

const back = () => {
  router.push("/");
};
</script>

<!-- <style>
.blog-content img {
  max-width: 100% !important;
}
</style> -->

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}

.wricomm-header {
  width: 80vw;
  display: grid;
  grid-template-areas: "head input submit";
  grid-template-columns: 5% 80% 5%;
  grid-column-gap: 5px;
}

.showcomments {
  padding-bottom: 30px;
}

.comments .input-avatar {
  grid-area: head;
}

.comments .input {
  grid-area: input;
}
.comments .sub {
  grid-area: submit;
}

.comments-item {
}

.comments-item .name {
  font-size: small;
}

.comments-item .content {
  padding: 10px 0;
}
.comments-item .time {
  font-size: small;
}

.preuploadpic {
  height: 60px;
}
</style>