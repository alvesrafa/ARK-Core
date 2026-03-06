<?php

namespace App\Providers;

use AzureOss\Storage\Blob\BlobServiceClient;
use AzureOss\Storage\BlobFlysystem\AzureBlobStorageAdapter;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production', 'homolog')) {
            URL::forceScheme('https');
        }

        $this->registerAzureBlobDriver();
    }

    private function registerAzureBlobDriver(): void
    {
        Storage::extend('azure', function ($app, $config) {
            $serviceClient = BlobServiceClient::fromConnectionString($config['connection_string']);
            $containerClient = $serviceClient->getContainerClient($config['container']);

            $adapter = new AzureBlobStorageAdapter($containerClient, prefix: $config['prefix'] ?? '');

            return new FilesystemAdapter(
                new Filesystem($adapter),
                $adapter,
                $config,
            );
        });
    }
}
