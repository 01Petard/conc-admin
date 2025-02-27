import Vue from 'vue'
import Router from 'vue-router'
import Button from "../components/example/Button.vue";
import ButtonDetail from "../components/example/ButtonDetail.vue";
import Link from "../components/example/Link.vue";
import Layout from "../components/example/Layout.vue";
import Container from "../components/example/Container.vue";
import ContrainerExam from "../components/example/ContrainerExam.vue";
import Radio from "../components/example/Radio.vue";
import Checkbox from "../components/example/Checkbox.vue";
import Input from "../components/example/Input.vue";
import Select from "../components/example/Select.vue";
import Switch from "../components/example/Switchs.vue";
import DatePrickers from "../components/example/DatePrickers.vue";
import Uploads from "../components/example/Uploads.vue";
import Form from "../components/example/Form.vue";
import Messages from "../components/example/Messages.vue";
import Dashboard from "../components/Dashboard.vue";
import StudentList from "../components/StudentList.vue";
import StudentAdd from "../components/StudentAdd.vue";
import ClassAdd from "../components/example/ClassAdd.vue";
import FaceUpload from "../components/FaceUpload.vue";
import ClassList from "../components/example/ClassList.vue";
import VideoList from "../components/VideoList.vue";
import VideoAdd from "../components/VideoAdd.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/button', component: Button},
    {path: '/buttondetail', component: ButtonDetail},
    {path: '/link', component: Link},
    {path: '/layout', component: Layout},
    {path: '/container', component: Container},
    {path: '/containerexam', component: ContrainerExam},
    {path: '/radio', component: Radio},
    {path: '/checkbox', component: Checkbox},
    {path: '/input', component: Input},
    {path: '/select', component: Select},
    {path: '/switch', component: Switch},
    {path: '/datePickers', component: DatePrickers},
    {path: '/upload', component: Uploads},
    {path: '/form', component: Form},
    {path: '/msg', component: Messages},
    {path: '/dashboard', component: Dashboard},
    {path: '/student-list', component: StudentList},
    {path: '/student-add', component: StudentAdd},
    {path: '/video-list', component: VideoList},
    {path: '/video-add', component: VideoAdd},
    {path: '/class-list', component: ClassList},
    {path: '/class-add', component: ClassAdd},
    {path: '/face-upload', component: FaceUpload},
  ]
})
