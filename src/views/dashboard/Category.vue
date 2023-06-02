<template>
  <div>
    <n-button @click="showAddModel = true">添加</n-button>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categoryList" :key="category._id">
          <td>{{ category._id }}</td>
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td>
            <n-space>
              <n-button @click="toUpdate(category)">修改</n-button>
              <n-button @click="deleteCategory(category)">删除</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>

    <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
      <template #header>
        <div>添加分类</div>
      </template>
      <div>
        <n-input
          v-model:value="addCategory.name"
          type="text"
          placeholder="请输入名称"
        />
        <n-input
          v-model:value="addCategory.description"
          type="text"
          placeholder="请输入分类描述"
        />
      </div>
      <template #action>
        <div>
          <n-button @click="add">提交</n-button>
        </div>
      </template>
    </n-modal>

    <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
      <template #header>
        <div>修改分类</div>
      </template>
      <div>
        <n-input
          v-model:value="updateCategory.name"
          type="text"
          placeholder="请输入名称"
        />
        <n-input
          v-model:value="updateCategory.description"
          type="text"
          placeholder="请输入描述"
        />
      </div>
      <template #action>
        <div>
          <n-button @click="update">提交</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
// import { AdminStore } from "../../stores/AdminStore";
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { AdminStore } from "../../stores/AdminStore";
const router = useRouter();
const route = useRoute();

const message = inject("message");
const dialog = inject("dialog");
const axios = inject("axios");

const adminStore = AdminStore();

const showAddModel = ref(false);
const showUpdateModel = ref(false);

const categoryList = ref([]);

const addCategory = reactive({
  name: "",
  description: "",
});

const updateCategory = reactive({
  id: 0,
  name: "",
  description: "",
});

onMounted(() => {
  loadDatas();
});

const loadDatas = async () => {
  let res = await axios.get("/category/list");
  categoryList.value = res.data.categorys;
  console.log(res);
};

const add = async () => {
  let res = await axios.post(
    "/category/add",
    {
      name: addCategory.name,
      description: addCategory.description,
    },
    { headers: { authorization: "bear " + adminStore.token } }
  );
  if (res.data.code == 200) {
    loadDatas();
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
  showAddModel.value = false;
};

// 准备修改分类（管理员）
const toUpdate = async (category) => {
  showUpdateModel.value = true;
  updateCategory.id = category._id;
  updateCategory.name = category.name;
  updateCategory.description = category.description;
};
const update = async () => {
  let res = await axios.put(
    "/category/update",
    {
      id: updateCategory.id,
      name: updateCategory.name,
      description: updateCategory.description,
    },
    { headers: { authorization: "bear " + adminStore.token } }
  );
  if (res.data.code == 200) {
    loadDatas();
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
  showUpdateModel.value = false;
};

const deleteCategory = async (category) => {
  dialog.warning({
    title: "警告",
    content: "是否要删除",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      let res = await axios.delete(`/category/delete?id=${category._id}`, {
        headers: { authorization: "bear " + adminStore.token },
      });
      console.log("删除的res:", res);
      if (res.data.code == 200) {
        loadDatas();
        message.info(res.data.msg);
      } else {
        message.error(res.data.msg);
      }
    },
    onNegativeClick: () => {},
  });
};
</script>

<style lang="scss" scoped>
</style>