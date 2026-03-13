<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class ProfileStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:profiles,name'],
            'modules' => ['array'],
            'modules.*' => ['integer', 'exists:modules,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O nome do perfil e obrigatorio.',
            'name.string' => 'O nome do perfil deve ser um texto valido.',
            'name.max' => 'O nome do perfil deve ter no maximo 255 caracteres.',
            'name.unique' => 'Este nome de perfil ja esta em uso.',
            'modules.array' => 'Selecione os modulos que este perfil pode acessar.',
            'modules.*.exists' => 'Um dos modulos selecionados e invalido.',
        ];
    }
}
