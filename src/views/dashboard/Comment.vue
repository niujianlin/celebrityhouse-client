<template>
  <div>
    <!-- <n-button @click="showAddModel = true">添加</n-button> -->
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>评论</th>
          <th>时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comment in commentList" :key="comment._id">
          <td>{{ comment._id }}</td>
          <td>{{ comment.content }}</td>
          <td>{{ comment.time }}</td>
          <td>
            <n-space>
              <n-button @click="toCommentinfo(comment)">详情</n-button>
              <n-button @click="deleteComment(comment)">删除</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>

    <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
      <template #header>
        <div>查看评论</div>
      </template>
      <div>
        <n-input
          v-model:value="commentinfo._id"
          type="text"
          placeholder="评论内容"
        />
        <n-input
          v-model:value="commentinfo.time"
          type="text"
          placeholder="评论内容"
        />
        <n-input
          v-model:value="commentinfo.content"
          type="text"
          placeholder="请输入描述"
        />
      </div>
      <template #action>
        <div>
          <n-button @click="closeinfo">关闭</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStore";
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const message = inject("message");
const dialog = inject("dialog");
const axios = inject("axios");

const adminStore = AdminStore();

const showAddModel = ref(false);
const showUpdateModel = ref(false);

const commentList = ref([]);

const commentinfo = reactive({
  time: "",
  _id: "",
  content: "",
});

onMounted(() => {
  loadDatas();
});

const loadDatas = async () => {
  let res = await axios.get("/comment/list");
  commentList.value = res.data.data;
  console.log(res);
};

// 查看
const toCommentinfo = async (comment) => {
  showUpdateModel.value = true;
  commentinfo._id = comment._id;
  commentinfo.time = comment.time;
  commentinfo.content = comment.content;
};
const closeinfo = async () => {
  showUpdateModel.value = false;
};

const deleteComment = async (comment) => {
  dialog.warning({
    title: "警告",
    content: "是否要删除",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      let res = await axios.delete(
        `/comment/delete?id=${comment._id}&uid=${comment.uid}`,
        { headers: { authorization: "bear " + adminStore.token } }
      );
      console.log("删除的res:", res);
      if (res.data.code == 200) {
        loadDatas();
        message.info(res.data.msg);
      } else {
        router.push("/dashboard");
        message.error(res.data.msg);
      }
    },
    onNegativeClick: () => {},
  });
};
</script>

<style lang="scss" scoped>
</style>