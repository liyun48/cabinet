<template>
  <div>
    <!-- 关于我们 -->
    <img class="img" src="@/assets/u1.png" alt="">
    <!-- <div class="info">
      <div class="title">公司介绍</div>
      <div class="content">少时诵诗书所所所</div>
    </div>
    <div class="tel">
      <div class="title">公司介绍</div>
      <div class="content">少时诵诗书所所所</div>
    </div> -->
    <!-- 公司介绍 -->
    <div class="introduce">
      <el-row>
        <el-col :span="3"><div class="title">公司介绍</div></el-col>
        <el-col :span="21"><div class="content">
          上海俊悦光纤网络科技有限公司成立于2002年，现有注册资金人民币3000万。是一家专业从事电磁屏蔽机房工程、智能综合布线工程、防战争防灾难云计算大数据IDC、智慧城市总体解决方案、保密会议室建设、云计算、智能屏蔽机柜系列产品和信息设备机房和产品的研制、设计、制造、安装和施工，并集销售与服务于一体的高科技企业。
          <br>
          本公司具有《建筑智能化工程承包资质》、《涉及国家秘密的计算机系统集成屏蔽室建设》、《涉及国家秘密的计算机系统集成综合布线》、《信息系统集成及服务资质证书》、《电磁屏蔽机房D级证书》、《电磁屏蔽机柜C级证书》等资质，同时拥有《电磁屏蔽室屏蔽网络线过壁装置》等多项发明专利证书,并通过ISO9001质量体系认证。
          <br>
          本公司研发的屏蔽系列工程和智慧城市方案广泛应用于全国各省市党、政、军、警、航空、航天、船舶等重要企业的涉密计算机信息网络系统、各省市街道，为国家政务网、公务网、党务网信息化建设作出了应有的贡献。
          <br>
          本公司坚持以“质量第一，服务至上”为理念，以一流的技术、卓越的品质、优良的售后服务为宗旨。
          <br>
          本公司近年来迅速扩展，员工队伍不断壮大，专业素质不断提高，在用户中享有较高的声誉。
        </div></el-col>
      </el-row>
      <el-row>
        <el-col :span="3"><div class="title">联系方式</div></el-col>
        <el-col :span="21"><div class="content">021-69921798 <br><br><br></div></el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped>
.img {
  width: 100%;
  height: 200px;
}
.introduce {
  width: 80%;
  margin-left: 10%;
  padding: 1em 0;
  overflow-y: auto;
}
.title {
  padding: 1em;
  font-size: 1.7em;
}
.content {
  border-left: 1px solid #2a506e;
  line-height: 1.5em;
  padding: 1em;
  font-size: 1.2em;
}
/* .info > div {
  float: left;
  padding: 20px;
}
.info .title {
  border-right: 1px solid #cccccc;
}
.tel > div {
  float: left;
  padding: 20px;
}
.tel .title {
  border-right: 1px solid #cccccc;
} */
</style>
