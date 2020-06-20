<template>
  <md-dialog :md-active.sync="isActive">
    <md-dialog-title>Завантаження файлів</md-dialog-title>
    <md-dialog-content>
      <div class="md-layout md-alignment-center md-size-100">
        <div class="md-layout-item md-size-100 custom__md-layout-item">
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            accept="image/*"
            @change="selectFiles"
            multiple
          />
          <md-button class="md-primary" @click="choseFile()">
            <md-icon>attach_file</md-icon>
            Оберіть файли
          </md-button>
        </div>

        <div
          class="md-layout-item md-size-100 custom__md-layout-item"
          v-if="filesSrc.length > 0"
        >
          <drop-down
            labelSearchPlaceholder="Пошук"
            labelTitle="Категорія"
            labelNotFound="Не знайдено"
            textProp="title"
            :table="table"
            v-model="category"
          />
          <div
            class="image-preview-item"
            v-for="(fileSrc, index) in filesSrc"
            :key="index"
          >
            <div class="image-preview-item__img">
              <md-button
                class="md-icon-button md-dense md-danger custom__md-icon-button"
                @click="removePic(index)"
              >
                <md-icon>close</md-icon>
              </md-button>
              <img :src="fileSrc" alt="image" class="img-preview" />
            </div>
            <div class="image-preview-item__description">
              <md-field>
                <label>Короткий опис</label>
                <md-textarea v-model="files[index].description"></md-textarea>
              </md-field>
            </div>
          </div>
        </div>
      </div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-default" @click="$emit('close-dialog')">
        <md-icon>close</md-icon>
        Закрити
      </md-button>
      <md-button class="md-success" @click="upload()">
        <loading v-if="uploading" />
        <span v-else>
          <md-icon>save</md-icon>
          Завантажити
        </span>
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { MiniLoading } from "@/components/Loading/index.js";
import DropDown from "@/components/Dropdown/index.vue";
import { Gallery } from "@/services/index";
const { uploadPicture } = new Gallery();
import { Categories } from "@/services/index";
const { updateCount } = new Categories();

export default {
  name: "upload-photos",
  props: {
    isActive: Boolean,
    table: [String, Number]
  },
  data() {
    return {
      uploading: false,
      files: [],
      filesSrc: [],
      category: {}
    };
  },
  computed: {
    token() {
      return this.$store.getters.getUser.token;
    },
    catId() {
      return this.category.hasOwnProperty("id") ? this.category.id : "";
    }
  },
  methods: {
    choseFile() {
      this.$refs.fileInput.click();
    },

    selectFiles(e) {
      const files = e.target.files;
      for (let i = 0; files.length > i; i++) {
        const reader = new FileReader();
        reader.onload = e => {
          this.filesSrc.push(reader.result);
        };
        reader.readAsDataURL(files[i]);
      }
      files.forEach(element => {
        this.files.push({ file: element, description: "" });
      });
    },

    removePic(index) {
      this.filesSrc.splice(index, 1);
      this.files.splice(index, 1);
    },

    closeDialog() {
      this.clearData();
      this.$emit("closeDialog");
    },

    async upload() {
      if (this.files.length === 0) {
        this.notifyVue("Оберіть файл зображення.", "warning", "danger");
        return;
      }

      this.uploading = true;
      const queriesArr = [];
      let items = 0;
      this.files.forEach(el => {
        items++;
        queriesArr.push(
          uploadPicture({
            file: el.file,
            desc: el.description,
            category: this.catId
          })
        );
      });

      const resArr = await Promise.all(queriesArr);
      resArr.forEach(el => {
        if (el.success) {
          this.notifyVue("Файл успішно завантажено", "done", "success");
        } else {
          const messages = el.messages.join(" ");
          this.notifyVue(
            "Сталася помилка при завантаженні",
            "warning",
            "danger"
          );
        }
      });

      //update items coun in category
      await updateCount({
        id: this.catId,
        table: this.table,
        action: "new",
        token: this.token,
        itemsCount: items
      });

      this.uploading = false;
      this.$emit("update-list-of-images", this.files.length);
      this.$emit("close-dialog");
      this.clearData();
      return;
    },

    clearData() {
      this.filesSrc = [];
      this.files = [];
    },

    notifyVue(
      message,
      icon,
      type,
      verticalAlign = "top",
      horizontalAlign = "right"
    ) {
      this.$notify({ message, icon, horizontalAlign, verticalAlign, type });
    }
  },
  components: {
    loading: MiniLoading,
    DropDown
  }
};
</script>

<style lang="scss" scoped>
.custom__md-layout-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 10px;
}

.image-preview-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;

  &__img {
    position: relative;
    width: 48%;
  }

  &__description {
    width: 48%;
  }
}

.img-preview {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.custom__md-icon-button {
  margin: 0;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
