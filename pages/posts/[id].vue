<template>
  <div class="post-page">
    <div v-if="isLoading" class="post-page__loading">Загрузка поста...</div>

    <div v-else-if="error" class="post-page__error">
      {{ error }}
    </div>

    <template v-else>
      <article class="post">
        <h1 class="post__title">{{ post.title }}</h1>

        <div class="post__meta">
          <span class="post__date">{{ formatDate(post.createdAt) }}</span>
          <span class="post__author">{{
            post.author || "Анонимный автор"
          }}</span>
        </div>

        <div
          class="post__content markdown-content"
          v-html="renderedContent"
        ></div>

        <div class="post__actions" v-if="isAuthor">
          <NuxtLink :to="`/posts/edit/${post.id}`" class="post__edit-btn">
            Редактировать
          </NuxtLink>
          <button
            @click="handleDelete"
            class="post__delete-btn"
            :disabled="isDeleting"
          >
            {{ isDeleting ? "Удаление..." : "Удалить" }}
          </button>
        </div>
      </article>

      <section class="comments-section">
        <CommentForm v-if="isAuthenticated" @submit="handleCommentSubmit" />
        <CommentList
          :comments="comments"
          :is-loading="isLoadingComments"
          :error="commentsError"
        />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const post = ref<any>(null);
const comments = ref<any[]>([]);
const isLoading = ref(true);
const isLoadingComments = ref(true);
const error = ref("");
const commentsError = ref("");
const isDeleting = ref(false);

// Получаем доступ к плагину Markdown
const { $md } = useNuxtApp();

// Преобразуем содержимое поста из Markdown в HTML
const renderedContent = computed(() => {
  if (!post.value || !post.value.content) return "";
  return $md.render(post.value.content);
});

// В реальном приложении эти значения должны приходить из хранилища состояния
const isAuthenticated = ref(true);
const isAuthor = ref(true);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:3001/posts/${route.params.id}`
    );
    if (!response.ok) throw new Error("Пост не найден");
    post.value = await response.json();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Ошибка при загрузке поста";
  } finally {
    isLoading.value = false;
  }

  try {
    const response = await fetch(
      `http://localhost:3001/posts/${route.params.id}/comments`
    );
    if (!response.ok) throw new Error("Не удалось загрузить комментарии");
    comments.value = await response.json();
  } catch (e) {
    commentsError.value =
      e instanceof Error ? e.message : "Ошибка при загрузке комментариев";
  } finally {
    isLoadingComments.value = false;
  }
});

const handleCommentSubmit = async (comment: { text: string }) => {
  try {
    const response = await fetch(
      `http://localhost:3001/posts/${route.params.id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...comment,
          postId: route.params.id,
          createdAt: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) throw new Error("Не удалось отправить комментарий");

    const newComment = await response.json();
    comments.value.unshift(newComment);
  } catch (e) {
    alert(e instanceof Error ? e.message : "Ошибка при отправке комментария");
  }
};

const handleDelete = async () => {
  if (!confirm("Вы уверены, что хотите удалить этот пост?")) return;

  isDeleting.value = true;
  try {
    const response = await fetch(
      `http://localhost:3001/posts/${route.params.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) throw new Error("Не удалось удалить пост");

    router.push("/posts");
  } catch (e) {
    alert(e instanceof Error ? e.message : "Ошибка при удалении поста");
    isDeleting.value = false;
  }
};

// Добавляем метаданные для SEO
useHead({
  title: computed(() => post.value?.title || "Загрузка..."),
  meta: [
    {
      name: "description",
      content: computed(
        () => post.value?.content?.substring(0, 160) || "Загрузка поста..."
      ),
    },
  ],
});
</script>

<style lang="scss">
.post-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  &__loading,
  &__error {
    text-align: center;
    padding: 3rem;
    background: #f8f9fa;
    border-radius: 8px;
    color: #666;
  }

  &__error {
    color: #dc3545;
  }
}

.post {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  &__title {
    font-size: 2.5rem;
    color: #333;
    margin: 0 0 1rem;
  }

  &__meta {
    display: flex;
    gap: 1rem;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  &__content {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #444;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    p {
      margin-bottom: 1.5rem;
    }

    ul,
    ol {
      margin-bottom: 1.5rem;
      margin-left: 1.5rem;
    }

    pre {
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    img {
      margin: 1rem 0;
      border-radius: 4px;
      max-width: 100%;
    }

    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1rem;
      font-style: italic;
      color: #666;
      margin: 1.5rem 0;
    }
  }

  &__actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
  }

  &__edit-btn,
  &__delete-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  &__edit-btn {
    background-color: #007bff;
    color: white;
    text-decoration: none;

    &:hover {
      background-color: #0056b3;
    }
  }

  &__delete-btn {
    background-color: #dc3545;
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background-color: #c82333;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}

.comments-section {
  margin-top: 3rem;
}
</style>
