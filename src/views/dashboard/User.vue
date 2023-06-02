<template>
  <div>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>账户</th>
          <th>邮箱</th>
          <th>权限</th>
          <th>状态</th>
          <th>介绍</th>
          <th>注册时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="userinfo in userList" :key="userinfo._id">
          <td>{{ userinfo._id }}</td>
          <td>{{ userinfo.account }}</td>
          <td>{{ userinfo.email }}</td>
          <td>{{ userinfo.role }}</td>
          <td>{{ userinfo.state }}</td>
          <td>{{ userinfo.intro }}</td>
          <td>{{ userinfo.registertime }}</td>
          <td>
            <n-space>
              <n-button @click="toUpdate(userinfo)">修改</n-button>
              <!-- <n-button @click="deleteCategory(userinfo)">删除</n-button> -->
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>

    <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
      <template #header>
        <div>修改分类</div>
      </template>
      <div>
        <n-input
          v-model:value="updateUser.account"
          type="text"
          placeholder="请输入名称"
        />
        <n-input
          v-model:value="updateUser.state"
          type="text"
          placeholder="请输入描述"
        />
        <n-input
          v-model:value="updateUser.description"
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
import { AdminStore } from "../../stores/AdminStore";
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const message = inject("message");
const dialog = inject("dialog");
const axios = inject("axios");

const adminStore = AdminStore();

const showUpdateModel = ref(false);

const userList = ref();

const updateUser = reactive({
  id: "",
  state: 0,
  account: "",
  role: "",
  email: "",
  registertime: "",
  intro: "",
});

onMounted(() => {
  loadDatas();
});

const loadDatas = async () => {
  let res = await axios.get("/admin/user", {
    headers: { authorization: "bear " + adminStore.token },
  });
  userList.value = res.data.data;
  console.log(res);
  console.log("userList = ", userList);
};

// 准备修改用户信息
const toUpdate = async (userinfo) => {
  showUpdateModel.value = true;
  updateUser.id = userinfo._id;
  updateUser.account = userinfo.account;
  updateUser.email = userinfo.email;
  updateUser.intro = userinfo.intro;
  updateUser.role = userinfo.role;
  updateUser.state = userinfo.state;
  updateUser.registertime = userinfo.registertime;
};
const update = async () => {
  let res = await axios.put(
    "/admin/useredit",
    {
      _id: updateUser.id,
      account: updateUser.account,
      email: updateUser.email,
      intro: updateUser.intro,
      registertime: updateUser.registertime,
      role: updateUser.role,
      state: updateUser.state,
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

// const deleteCategory = async (category) => {
//   dialog.warning({
//     title: "警告",
//     content: "是否要删除",
//     positiveText: "确定",
//     negativeText: "取消",
//     onPositiveClick: async () => {
//       let res = await axios.delete(
//         `/category/_token/delete?id=${category._id}`
//       );
//       console.log("删除的res:", res);
//       if (res.data.code == 200) {
//         loadDatas();
//         message.info(res.data.msg);
//       } else {
//         message.error(res.data.msg);
//       }
//     },
//     onNegativeClick: () => {},
//   });
// };
</script>

<style lang="scss" scoped>
</style>