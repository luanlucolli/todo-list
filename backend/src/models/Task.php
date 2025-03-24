<?php

class Task {
    public $id;
    public $title;
    public $description;
    public $status;
    public $created_at;
    public $updated_at;

    public function __construct($data) {
        $this->id = $data['id'] ?? null;
        $this->title = $data['title'];
        $this->description = $data['description'] ?? '';
        $this->status = $data['status'] ?? 0;
        $this->created_at = $data['created_at'] ?? null;
        $this->updated_at = $data['updated_at'] ?? null;
    }
}
