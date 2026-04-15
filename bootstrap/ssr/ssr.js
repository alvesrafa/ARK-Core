import { jsx, jsxs } from "react/jsx-runtime";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as Toast from "@radix-ui/react-toast";
import { X, Info, AlertCircle, CheckCircle, Users, Shield, LayoutDashboard } from "lucide-react";
import { createContext, useState, useCallback, forwardRef } from "react";
import { usePage, Head, Link, useForm, router, createInertiaApp } from "@inertiajs/react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as LabelPrimitive from "@radix-ui/react-label";
import { z } from "zod";
import ReactDOMServer from "react-dom/server";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastContext = createContext(void 0);
const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const notify = useCallback((title, options) => {
    setToast({
      title,
      description: options?.description || "",
      duration: options?.duration || 4e3,
      type: options?.type || "info"
    });
    setOpen(false);
    requestAnimationFrame(() => setOpen(true));
  }, []);
  const notifySuccess = useCallback(
    (title, description, duration) => {
      notify(title, { description, duration, type: "success" });
    },
    [notify]
  );
  const notifyInfo = useCallback(
    (title, description, duration) => {
      notify(title, { description, duration, type: "info" });
    },
    [notify]
  );
  const notifyError = useCallback(
    (title, description, duration) => {
      notify(title, { description, duration, type: "error" });
    },
    [notify]
  );
  const getIconAndStyles = (type) => {
    switch (type) {
      case "success":
        return {
          icon: /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-green-600" }),
          className: "border-green-200 bg-green-50"
        };
      case "error":
        return {
          icon: /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-red-600" }),
          className: "border-red-200 bg-red-50"
        };
      case "info":
      default:
        return {
          icon: /* @__PURE__ */ jsx(Info, { className: "h-5 w-5 text-blue-600" }),
          className: "border-blue-200 bg-blue-50"
        };
    }
  };
  return /* @__PURE__ */ jsx(ToastContext.Provider, { value: { notify, notifySuccess, notifyInfo, notifyError }, children: /* @__PURE__ */ jsxs(Toast.Provider, { swipeDirection: "right", duration: toast?.duration, children: [
    children,
    toast && /* @__PURE__ */ jsxs(
      Toast.Root,
      {
        open,
        onOpenChange: setOpen,
        className: cn(
          "flex w-[32rem] flex-col gap-2 rounded-lg border p-4 shadow-xl",
          getIconAndStyles(toast.type).className
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "shrink-0", children: getIconAndStyles(toast.type).icon }),
            /* @__PURE__ */ jsx(Toast.Title, { className: "flex-1 font-bold text-gray-900", children: toast.title }),
            /* @__PURE__ */ jsx(Toast.Close, { className: "shrink-0 rounded-full p-1 hover:bg-gray-100", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-gray-600" }) })
          ] }),
          toast.description && /* @__PURE__ */ jsx(Toast.Description, { className: "ml-8 text-sm text-gray-600", children: toast.description })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Toast.Viewport, { className: "fixed top-4 left-1/2 z-50 flex w-[32rem] -translate-x-1/2 flex-col items-center" })
  ] }) });
};
function AppLayout({ children, title }) {
  const { app, menus } = usePage().props;
  const iconMap = {
    "layout-dashboard": (props) => /* @__PURE__ */ jsx(LayoutDashboard, { ...props }),
    shield: (props) => /* @__PURE__ */ jsx(Shield, { ...props }),
    users: (props) => /* @__PURE__ */ jsx(Users, { ...props })
  };
  const menuItems = (menus ?? []).slice().sort((a, b) => (a.item_order ?? 0) - (b.item_order ?? 0));
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-gray-50", children: [
      /* @__PURE__ */ jsxs("aside", { className: "w-64 overflow-y-auto bg-blue-assefaz text-white", children: [
        /* @__PURE__ */ jsx("div", { className: "p-6", children: /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-white", children: app?.name || "ARK Core" }) }),
        /* @__PURE__ */ jsx("nav", { className: "px-3", children: menuItems.length === 0 ? /* @__PURE__ */ jsx("span", { className: "block px-3 py-2 text-xs uppercase tracking-wide text-white/50", children: "Sem modulos" }) : menuItems.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] : void 0;
          return /* @__PURE__ */ jsxs(
            Link,
            {
              href: item.path,
              className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white",
              children: [
                Icon ? /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx("span", { className: "h-4 w-4 rounded-full bg-white/30" }),
                item.name
              ]
            },
            item.slug
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 p-8", children })
    ] })
  ] });
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AppLayout
}, Symbol.toStringTag, { value: "Module" }));
function Dashboard() {
  return /* @__PURE__ */ jsx(AppLayout, { title: "Dashboard", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "adsasd" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Bem-vindo ao asdasdasRK asdasdCore." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" })
  ] }) });
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-assefaz text-white hover:bg-blue-assefaz/90",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100",
        link: "text-blue-assefaz underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
});
Button.displayName = "Button";
const Input = forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      className: cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-assefaz focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  );
});
Input.displayName = "Input";
const Label = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
    ...props
  }
));
Label.displayName = "Label";
const Table = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) }));
Table.displayName = "Table";
const TableHeader = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props })
);
TableHeader.displayName = "TableHeader";
const TableBody = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props })
);
TableBody.displayName = "TableBody";
const TableRow = forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tr", { ref, className: cn("border-b transition-colors hover:bg-gray-50", className), ...props }));
TableRow.displayName = "TableRow";
const TableHead = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("th", { ref, className: cn("h-12 px-4 text-left align-middle font-medium text-gray-500", className), ...props })
);
TableHead.displayName = "TableHead";
const TableCell = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("td", { ref, className: cn("p-4 align-middle", className), ...props })
);
TableCell.displayName = "TableCell";
function ProfilesForm({
  title,
  submitLabel,
  modules,
  onCancel,
  onSubmit,
  data,
  errors,
  processing,
  onChangeName,
  onToggleModule
}) {
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Defina o nome do perfil e os modulos permitidos." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        onCancel ? /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Voltar" }) : null,
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: submitLabel })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "profile-name", children: "Nome do perfil" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "profile-name",
          value: data.name,
          onChange: (event) => onChangeName(event.target.value),
          placeholder: "Digite o nome do perfil"
        }
      ),
      errors.name ? /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.name }) : null
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-gray-200", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Modulo" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-28 text-center", children: "Acesso" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: modules.map((module) => {
        const checked = Boolean(data.modules?.includes(module.id));
        return /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-gray-900", children: module.name }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked,
              onChange: (event) => onToggleModule(module.id, event.target.checked),
              className: "h-4 w-4 rounded border-gray-300 text-blue-assefaz focus:ring-blue-assefaz"
            }
          ) })
        ] }, module.id);
      }) })
    ] }) }),
    errors.modules ? /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.modules }) : null
  ] });
}
function useFormWithZod({
  schema,
  initialValues
}) {
  const form = useForm(initialValues);
  const validate = useCallback(() => {
    const result = schema.safeParse(form.data);
    if (!result.success) {
      const zodError = result.error;
      const errors = {};
      for (const issue of zodError.issues) {
        const key = issue.path.join(".");
        if (!errors[key]) {
          errors[key] = issue.message;
        }
      }
      form.clearErrors();
      for (const [key, message] of Object.entries(errors)) {
        form.setError(key, message);
      }
      return false;
    }
    form.clearErrors();
    return true;
  }, [form, schema]);
  const submitWithValidation = useCallback(
    (method, url) => {
      if (!validate()) return;
      form[method](url);
    },
    [form, validate]
  );
  return {
    ...form,
    validate,
    submitWithValidation
  };
}
const profileSchema = z.object({
  name: z.string().min(2, "Informe o nome do perfil."),
  modules: z.array(z.number()).optional()
});
function useProfilesForm(initialValues) {
  const form = useFormWithZod({
    schema: profileSchema,
    initialValues
  });
  const toggleModule = (moduleId, checked) => {
    const modules = form.data.modules ?? [];
    const next = checked ? [...modules, moduleId] : modules.filter((id) => id !== moduleId);
    form.setData("modules", Array.from(new Set(next)));
  };
  return {
    form,
    toggleModule
  };
}
function ProfileFormScreen({ title, submitLabel, modules, initialValues, method, url }) {
  const { form, toggleModule } = useProfilesForm({
    name: initialValues.name,
    modules: initialValues.modules ?? []
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    form.submitWithValidation(method, url);
  };
  return /* @__PURE__ */ jsx(
    ProfilesForm,
    {
      title,
      submitLabel,
      modules,
      onCancel: () => router.get("/profiles"),
      onSubmit: handleSubmit,
      data: form.data,
      errors: form.errors,
      processing: form.processing,
      onChangeName: (value) => form.setData("name", value),
      onToggleModule: toggleModule
    }
  );
}
function CreateProfilePage({ modules }) {
  return /* @__PURE__ */ jsx(AppLayout, { title: "Criar Perfil", children: /* @__PURE__ */ jsx(
    ProfileFormScreen,
    {
      title: "Criar perfil",
      submitLabel: "Criar",
      modules,
      initialValues: { name: "", modules: [] },
      method: "post",
      url: "/profiles"
    }
  ) });
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CreateProfilePage
}, Symbol.toStringTag, { value: "Module" }));
function EditProfilePage({ profile, modules }) {
  const moduleIds = profile.modules?.map((module) => module.id) ?? [];
  return /* @__PURE__ */ jsx(AppLayout, { title: "Editar Perfil", children: /* @__PURE__ */ jsx(
    ProfileFormScreen,
    {
      title: "Editar perfil",
      submitLabel: "Salvar",
      modules,
      initialValues: { name: profile.name, modules: moduleIds },
      method: "put",
      url: `/profiles/${profile.id}`
    }
  ) });
}
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EditProfilePage
}, Symbol.toStringTag, { value: "Module" }));
function ProfilesList({ profiles }) {
  const handleDelete = (profileId) => {
    if (!confirm("Deseja remover este perfil?")) return;
    router.delete(`/profiles/${profileId}`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Perfis" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Gerencie os perfis e seus acessos." })
      ] }),
      /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/profiles/create", children: "Novo perfil" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-gray-200", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Nome" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Modulos" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Acoes" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: profiles.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 3, className: "text-center text-sm text-gray-500", children: "Nenhum perfil cadastrado." }) }) : profiles.map((profile) => {
        const moduleCount = profile.modules?.length ?? profile.modules_count ?? 0;
        return /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium text-gray-900", children: profile.name }),
          /* @__PURE__ */ jsx(TableCell, { children: moduleCount }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: `/profiles/${profile.id}/edit`, children: "Editar" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(profile.id), children: "Remover" })
          ] }) })
        ] }, profile.id);
      }) })
    ] }) })
  ] });
}
function ProfilesPage({ profiles }) {
  return /* @__PURE__ */ jsx(AppLayout, { title: "Perfis", children: /* @__PURE__ */ jsx(ProfilesList, { profiles }) });
}
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProfilesPage
}, Symbol.toStringTag, { value: "Module" }));
function render(page) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./pages/dashboard.tsx": __vite_glob_0_0, "./pages/layouts/AppLayout.tsx": __vite_glob_0_1, "./pages/profiles/create.tsx": __vite_glob_0_2, "./pages/profiles/edit.tsx": __vite_glob_0_3, "./pages/profiles/index.tsx": __vite_glob_0_4 });
      return pages[`./pages/${name}.tsx`];
    },
    // @ts-expect-error SSR setup receives null element
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  });
}
export {
  render as default
};
